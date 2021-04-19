import React from "react";
import MQTT from "lib/MQTT";

import Picker from "./Picker";

class RGBTab extends React.Component {
  constructor(props) {
    super(props);
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

    this.state = {
      label: this.rgb.label,
      rgb: this.rgb,
      form: this.form,
    };
  }


  componentDidMount() {
  }

  componentWillUnmount() {
    localStorage.setItem("rgb-" + this.rgb.label, JSON.stringify(this.form));
  }

  render() {
    const f = this.form;
    return (
      <div style={{ padding: 10 }}>
        <Picker
          config={this.rgb}
          form={f}
          update={() => {
            MQTT.publish(`${this.hub}/${this.name}/set/red`, this.form.rgb.r);
            MQTT.publish(`${this.hub}/${this.name}/set/green`, this.form.rgb.g);
            MQTT.publish(`${this.hub}/${this.name}/set/blue`, this.form.rgb.b);
          }}
          onChange={(v) => {
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
        />
      </div>
    );
  }
}

//
export default RGBTab;
