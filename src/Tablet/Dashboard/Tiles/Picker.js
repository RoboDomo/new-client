import React from "react";

import { CustomPicker } from "react-color";
import {
  EditableInput,
  Hue,
  Saturation,
} from "react-color/lib/components/common";
import { Button } from "react-bootstrap";

// power is a function to call to toggle power
// active is whether power is on
const Picker = CustomPicker(
  ({
    config,
    form,
    onChange,
    onChangeComplete,
    update,
    close,
    power,
    active,
  }) => {
    const styles = {
      hue: {
        height: 40,
        width: 512,
        position: "relative",
        marginBottom: 10,
      },
      saturation: {
        width: 512,
        height: 460,
        position: "relative",
        marginBottom: 10,
      },
      input: {
        height: 36,
        width: 150,
        fontSize: 24,
        border: `1px solid ${form.hex}`,
        paddingLeft: 10,
      },
      swatch: {
        marginLeft: 40,
        width: 150,
        height: 80,
        border: "1px solid white",
        backgroundColor: form.hex,
        marginBottom: 10,
      },
      label: {
        fontSize: 18,
        marginTop: 8,
        float: "left",
        width: 40,
        color: "white",
      },
    };

    const handleChange = (data, e) => {
      form.changed = true;
      if (data.level) {
        form.level = data.level;
      }
      onChange(data, e);
    };

    return (
      <>
        <div style={{ width: 1024, color: "rgba(0,0,0,.0)" }}>
          <div style={{ float: "left", paddingLeft: 100 }}>
            <div style={styles.hue}>
              <Hue hsv={form.hsv} hsl={form.hsl} onChange={handleChange} />
            </div>
            <div style={styles.saturation}>
              <Saturation
                hex={form.hex}
                hsv={form.hsv}
                hsl={form.hsl}
                onChange={handleChange}
              />
            </div>
            <div>
              <Button
                variant={active ? undefined : "danger"}
                onClick={() => {
                  if (power) {
                    power("off");
                  }
                }}
              >
                Off
              </Button>
              <Button
                variant={active ? "success" : undefined}
                onClick={() => {
                  if (power) {
                    power("on");
                  }
                }}
              >
                On
              </Button>
            </div>
          </div>
          <div style={{ float: "right" }}>
            <div>
              <div style={styles.swatch} />
            </div>
            <div style={{ width: 300, whiteSpace: "nowrap" }}>
              <div style={styles.label}>#</div>
              <EditableInput
                label={"#"}
                style={{ input: styles.input, disabled: true }}
                value={form.hex.replace("#", "")}
                onChange={handleChange}
              />
            </div>
            <div style={{ width: 300, whiteSpace: "nowrap" }}>
              <div style={styles.label}>LVL</div>
              <EditableInput
                label={"level"}
                style={{ input: styles.input, disabled: true }}
                value={Math.round(form.level)}
                onChange={handleChange}
              />
            </div>
            <div style={{ width: 300, marginTop: 10, whiteSpace: "nowrap" }}>
              <div style={styles.label}>H</div>
              <EditableInput
                label={"h"}
                style={{ input: styles.input }}
                value={Math.round(form.hsv.h)}
                onChange={handleChange}
              />
            </div>
            <div style={{ width: 300, whiteSpace: "nowrap" }}>
              <div style={styles.label}>S</div>
              <EditableInput
                label={"s"}
                style={{ input: styles.input }}
                value={Math.round(form.hsv.s) * 100}
                onChange={handleChange}
              />
            </div>
            <div style={{ width: 300, whiteSpace: "nowrap" }}>
              <div style={styles.label}>V</div>
              <EditableInput
                label={"v"}
                style={{ input: styles.input }}
                value={Math.round(form.hsv.v * 100)}
                onChange={handleChange}
              />
            </div>

            <div style={{ width: 300, marginTop: 10, whiteSpace: "nowrap" }}>
              <div style={styles.label}>R</div>
              <EditableInput
                label={"r"}
                style={{ input: styles.input }}
                value={form.rgb.r}
                onChange={handleChange}
              />
            </div>
            <div style={{ width: 300, whiteSpace: "nowrap" }}>
              <div style={styles.label}>G</div>
              <EditableInput
                label={"g"}
                style={{ input: styles.input }}
                value={form.rgb.g}
                onChange={handleChange}
              />
            </div>
            <div style={{ width: 300, whiteSpace: "nowrap" }}>
              <div style={styles.label}>B</div>
              <EditableInput
                label={"b"}
                style={{ input: styles.input }}
                value={form.rgb.b}
                onChange={handleChange}
              />
            </div>

            <div style={{ height: 20 }} />
            <div
              style={{ fontSize: 18, marginTop: 18, float: "left", width: 40 }}
            >
              {" "}
            </div>
            <div>
              <Button
                onClick={() => {
                  update();
                }}
                style={{ width: 150 }}
                size="lg"
              >
                Update
              </Button>
            </div>
            <div
              style={{ fontSize: 18, marginTop: 18, float: "left", width: 40 }}
            >
              {" "}
            </div>
            <div style={{ marginTop: 4 }}>
              <Button
                size="lg"
                style={{ width: 150 }}
                onClick={() => {
                  if (close) {
                    close();
                  }
                }}
              >
                Close
              </Button>
            </div>
            <div
              style={{ fontSize: 18, marginTop: 18, float: "left", width: 40 }}
            >
              {" "}
            </div>
          </div>
        </div>
      </>
    );
  }
);

//
export default Picker;
