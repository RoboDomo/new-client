import React from "react";

import { ButtonGroup, Button } from "react-bootstrap";
import MQTTButton from "Common/MQTTButton";

import {
  FaChevronUp,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaPowerOff,
  FaVolumeMute,
  FaVolumeUp,
  FaVolumeDown,
  FaBackward,
  FaFastBackward,
  FaPause,
  FaPlay,
  FaForward,
  FaFastForward,
} from "react-icons/fa";

class TransportControls extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <ButtonGroup className="fixed-bottom" style={{margin: 0, padding: 0, width: 1024}}>
        <MQTTButton mini action="Prev">
          <FaFastBackward />
        </MQTTButton>
        <MQTTButton mini action="Rewind">
          <FaBackward />
        </MQTTButton>
        <MQTTButton mini action="Pause">
          <FaPause />
        </MQTTButton>
        <MQTTButton mini action="Play">
          <FaPlay />
        </MQTTButton>
        <MQTTButton mini action="Forward">
          <FaForward />
        </MQTTButton>
        <MQTTButton mini action="Next">
          <FaFastForward />
        </MQTTButton>
      </ButtonGroup>
    );
  }
}

export default TransportControls;
