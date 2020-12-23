import React from "react";
// import { Button } from "react-bootstrap";
import Picker from "./Picker";
import styles from "./styles";

import { MdPalette } from "react-icons/md";

import { isOn } from "lib/Utils";
import MQTT from "lib/MQTT";

class RGBTile extends React.Component {
  constructor(props) {
    super(props);
    this.tile = props.tile;
    this.style = styles.tile(1, 1);
    this.device = props.tile.device;
    // this.hub = props.tile.hub;
    //
    this.rgb = this.tile;
    console.log("rgb", this.rgb);
    this.hub = this.rgb.hub;
    this.name = this.rgb.name;
    this.form = localStorage.getItem(`rgb-${this.rgb.label}`);
    if (this.form) {
      this.form = JSON.parse(this.form);
    } else {
      this.form = {
        changed: false,
        hsv: {},
        hsl: {},
        rgb: {},
        active: false,
        level: 99,
        hex: "ff00ff",
      };
    }
    console.log("construct RGB", props);
    this.state = { show: false };
    //
    this.handlePowerMessage = this.handlePowerMessage.bind(this);
    this.handleColorMessage = this.handleColorMessage.bind(this);
  }

  handlePowerMessage(topic, message) {
    this.setState({ active: isOn(message) });
  }

  handleColorMessage(topic, message) {
    const color = topic.split("/").pop();
    switch (color) {
      case "red":
        this.form.rgb.r = message;
        break;
      case "green":
        this.form.rgb.g = message;
        break;
      case "blue":
        this.form.rgb.b = message;
        break;
      default:
        break;
    }
    this.setState({ rgb: this.form.rgb });
    console.log("COLOR", color, topic, message);
    // this.setState({ active: isOn(message) });
  }

  componentDidMount() {
    MQTT.subscribe(
      `${this.hub}/${this.device}/status/switch`,
      this.handlePowerMessage
    );
    MQTT.subscribe(
      `${this.hub}/${this.name}/status/red`,
      this.handleColorMessage
    );
    MQTT.subscribe(
      `${this.hub}/${this.name}/status/green`,
      this.handleColorMessage
    );
    MQTT.subscribe(
      `${this.hub}/${this.name}/status/blue`,
      this.handleColorMessage
    );
  }

  componentWillUnmount() {
    MQTT.unsubscribe(
      `${this.hub}/${this.device}/status/switch`,
      this.handlePowerMessage
    );
    MQTT.unsubscribe(
      `${this.hub}/${this.name}/status/red`,
      this.handleColorMessage
    );
    MQTT.unsubscribe(
      `${this.hub}/${this.name}/status/green`,
      this.handleColorMessage
    );
    MQTT.unsubscribe(
      `${this.hub}/${this.name}/status/blue`,
      this.handleColorMessage
    );
  }

  renderDialog() {
    if (!this.state.show) {
      return null;
    }

    const f = this.form,
      top = 0,
      width = 950,
      left = (1024 - width) / 2;

    return (
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          width: 1024,
          height: 700,
          backgroundColor: "rgb(51,52,54)",
          zIndex: 99,
        }}
      >
        <div
          style={{
            zIndex: 100,
            position: "absolute",
            top: top,
            left: left,
            width: width,
            backgroundColor: "rgb(51,52,54)",
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          <div
            style={{
              marginLeft: 100,
              fontSize: 40,
              color: "white",
              textAlign: "left",
            }}
          >
            {this.name} RGB
          </div>
          <Picker
            active={this.state.active}
            config={this.rgb}
            /* controller={controller} */
            form={f}
            power={(newState) => {
              MQTT.publish(`${this.hub}/${this.device}/set/switch`, newState);
            }}
            close={() => {
              this.setState({ show: false });
            }}
            update={() => {
              console.log("update", this.form);
              const h = this.form.hsv;
              /* MQTT.publish(`${this.hub}/${this.name}/set/color`,{hue: h.h, saturation: h.s, level: h.v}); */
              MQTT.publish(`${this.hub}/${this.name}/set/red`, this.form.rgb.r);
              MQTT.publish(
                `${this.hub}/${this.name}/set/green`,
                this.form.rgb.g
              );
              MQTT.publish(
                `${this.hub}/${this.name}/set/blue`,
                this.form.rgb.b
              );
            }}
            onChange={(v) => {
              //          this.hex = v;
              console.log("change v", v);
              if (v.hex) {
                f.hex = v.hex;
                f.changed = true;
              }
              if (v.rgb) {
                f.rgb = v.rgb;
                f.changed = true;
              }
              if (v.hsl) {
                f.hsl = v.hsl;
                f.changed = true;
              }
              if (v.hsv) {
                f.hsv = v.hsv;
                f.changed = true;
              }
              localStorage.setItem(
                "rgb-" + this.rgb.label,
                JSON.stringify(this.form)
              );
            }}
            onChangeComplete={(v) => {
              return;
            }}
          />
        </div>
      </div>
    );
  }

  render() {
    const style = Object.assign({}, this.style);
    style.color = this.state.active ? "yellow" : undefined;
    style.padding = 8;
    return (
      <>
        {this.renderDialog()}
        <div
          style={style}
          onClick={() => {
            this.setState({ show: true });
          }}
        >
          <MdPalette style={{ fontSize: 30 }} />
          <div>{this.tile.device}</div>
        </div>
      </>
    );
  }
}

//
export default RGBTile;
