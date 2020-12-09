import React from "react";
import MQTT from "lib/MQTT";

import Picker from "./Picker";

class RGBTab extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.rgb = props.rgb;
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
        power: false,
        level: 99,
        hex: "ff00ff",
      };
    }

    console.log("stored", this.form);

    this.state = {
      label: this.rgb.label,
      rgb: this.rgb,
      form: this.form,
    };

    //
    this.handleChange = this.handleChange.bind(this);
    this.handleRgbMessage = this.handleRgbMessage.bind(this);
  }

  handleChange(data, e) {
    console.log("handleChange", data);
    // this.setState(newState);
  }

  handleRgbMessage(topic, message) {
    const key = topic.split('/').pop();
    console.log("handleRgb", topic, message, key);
  }

  componentDidMount() {
    // for (const key of keys) {
    //   MQTT.subscribe(`${this.hub}/${this.rgb.name}/status/${key}`, this.handleRgbMessage);
    // }
  }
  componentWillUnmount() {
    localStorage.setItem("rgb-" + this.rgb.label, JSON.stringify(this.form));
    // for (const key of keys) {
    //   MQTT.unsubscribe(`${this.hub}/${this.rgb.name}/status/${key}`, this.handleRgbMessage);
    // }
  }

  render() {
    const f = this.form;
    return (
      <div style={{ padding: 10 }}>
        <Picker
          /* power={this.state.power} */
          config={this.rgb}
          /* controller={controller} */
          form={f}
          update={() => {
            console.log("update", this.form);
            MQTT.publish(`${this.hub}/${this.name}/set/red`, this.form.rgb.r);
            MQTT.publish(`${this.hub}/${this.name}/set/green`, this.form.rgb.g);
            MQTT.publish(`${this.hub}/${this.name}/set/blue`, this.form.rgb.b);
            /* controller.level = f.level; */
            /* controller.hex = f.hex; */
            /* controller.r = f.rgb.r; */
            /* controller.g = f.rgb.g; */
            /* controller.b = f.rgb.b; */
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
            //          controller.hex = v.hex;
            localStorage.setItem(
              "rgb-" + this.rgb.label,
              JSON.stringify(this.form)
            );
          }}
          onChangeComplete={(v) => {
            return;
            //          console.log("changeComplete v", v);
          }}
        />
      </div>
    );
  }
}

//
export default RGBTab;
