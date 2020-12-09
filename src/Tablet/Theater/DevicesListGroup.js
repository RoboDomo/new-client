import React from "react";
import { Badge, ListGroup, ListGroupItem } from "react-bootstrap";
// import Ripples from 'react-ripples';

// import { mangle } from "lib/Utils";

class DevicesListGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDevice: props.currentDevice,
    };
  }

  render() {
    let key = 0;
    const currentDevice = this.props.currentDevice || { name: null };

    const { devices } = this.props;
    const { avr, tv } = this.props;
    if (!devices) {
      return null;
    }

    return (
      <div>
        <div style={{ fontWeight: "bold", textAlign: "center", fontSize: 12 }}>
          Devices
        </div>
        <ListGroup>
          {devices.map((device) => {
            let badge = "OFF";
            switch (device.type) {
              case "bravia":
              case "lgtv":
                badge = tv;
                break;
              case "denon":
                badge = avr;
                break;
              default:
                badge = null;
                break;
            }
            return (
              <ListGroupItem
                key={key++}
                style={{ fontWeight: "bold", width: "100%" }}
                active={currentDevice.name === device.name}
                onClick={() => {
                  if (this.props.onClick) {
                    this.props.onClick(device);
                  }
                }}
              >
                {device.name}
                {badge ? (
                  <Badge variant="secondary" className="float-right">
                    {badge}
                  </Badge>
                ) : null}
              </ListGroupItem>
            );
          })}
        </ListGroup>
      </div>
    );
  }
}

//
export default DevicesListGroup;
