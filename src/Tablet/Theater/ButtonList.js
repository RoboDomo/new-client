import React from "react";
import { ButtonGroup } from "react-bootstrap";

// import ThermostatButton from "Common/ThermostatButton";
import MQTTButton from "Common/MQTTButton";
import FanButton from "Common/FanButton";
import DimmerButton from "Common/DimmerButton";
// import ThermostatButton from "Common/ThermostatButton";
import IComfortButton from "Common/IComfortButton";

class ButtonList extends React.Component {
  constructor(props) {
    super(props);
    this.theater = props.theater;
  }

  render() {
    const theater = this.theater;
    let key = 0;
    return (
      <div style={{ textAlign: "center" }}>
        <ButtonGroup vertical>
          {theater.buttons.map((button) => {
            switch (button.type) {
              case "label":
                return (
                  <div
                    key={key++}
                    style={{ textAlign: "center", width: "100%" }}
                  >
                    {button.text}
                  </div>
                );
              case "thermostat":
                return (
                  <div
                    key={key++}
                    style={{ textAlign: "center", width: "100%" }}
                  >
                    <IComfortButton
                      zone={button.zone}
                      device={button.device}
                      weather={button.weather}
                    />
                  </div>
                );
              case "macro":
                return (
                  <div
                    key={key++}
                    style={{ textAlign: "center", width: "100%" }}
                  >
                    <MQTTButton macro={button.name}>
                      <span style={{ whiteSpace: "nowrap" }}>
                        {button.name}
                      </span>
                    </MQTTButton>
                  </div>
                );
              case "fan":
                return (
                  <div
                    key={key++}
                    style={{ textAlign: "center", width: "100%" }}
                  >
                    <FanButton hub={button.hub} name={button.device} />
                  </div>
                );
              case "dimmer":
                return (
                  <div
                    key={key++}
                    style={{ textAlign: "center", width: "100%" }}
                  >
                    <DimmerButton hub={button.hub} name={button.device} />
                  </div>
                );
              default:
                return (
                  <div
                    key={key++}
                    style={{ textAlign: "center", width: "100%" }}
                  >
                    <MQTTButton>
                      <span style={{ whiteSpace: "nowrap" }}>
                        {button.name}
                      </span>
                    </MQTTButton>
                  </div>
                );
            }
          })}
        </ButtonGroup>
      </div>
    );
  }
}

export default ButtonList;
