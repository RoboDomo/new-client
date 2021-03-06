import React from "react";
// import Ripples from "react-ripples";
import { Button } from "react-bootstrap";

import MQTT from "lib/MQTT";

class MQTTButton extends React.Component {
  constructor(props) {
    super(props);
    this.topic = props.topic;
    this.message = props.message;
    this.mini = props.mini;
    this.style = {
      width: this.mini ? 46 : 100,
      height: 40,
      fontSize: 14,
      paddingBottom: 22,
      marginRight: 1,
    };
    if (props.transport) {
      delete this.style.width;
    }
  }

  render() {
    switch (this.props.variant) {
      // render no button at all, but a button sized div instead
      case "none":
        return <div style={this.style} />;

      default:
        return (
          <Button
            style={this.style}
            variant={this.props.variant}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (this.props.onClick) {
                this.props.onClick(e);
              } else {
                MQTT.publish(this.topic, this.message);
              }
            }}
          >
            {this.props.children}
          </Button>
        );
    }
  }
}

//
export default MQTTButton;
