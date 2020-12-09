import React /*, { useState, useEffect, useRef }*/ from "react";

import ReactBootstrapSlider from "react-bootstrap-slider";
import Toggle from "react-bootstrap-toggle";

import {isOn} from "lib/Utils";

class DimmerField extends React.Component {
  constructor(props) {
    super(props);
    this.label = props.label;
    this.name = props.name;
    this.value = props.value;
    this.toggled = props.toggled;
    this.onToggle = props.onToggle;
    this.onValueChange = props.onValueChange;
    //
    this.applyValueChange = this.applyValueChange.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleToggle = this.handleToggle.bind(this);

    this.state = {
      value: props.value,
      switch: isOn(this.toggled)
    };

    console.log("construct", this.state);
  }

  applyValueChange(val) {
    this.value = val;
    this.setState({ value: val});

    if (this.onValueChange) {
      this.onValueChange(`${this.name}/level`, this.value);
    }
  }

  handleSliderChange(e) {
    const val = e.target.value;
    this.applyValueChange(val);
  }

  handleToggle(state) {
    console.log("toggle", this.props.toggled);
    this.setState({ switch: !this.props.toggled});
    if (this.onToggle) {
      this.onToggle(this.name, !this.props.toggled);
    }
  }

  render() {
    // console.log("render", this.label, this.state);
    return (
      <div style={{ display: "flex", marginTop: 10 }}>
        <div style={{ marginTop: 10, flex: 1 }}>{this.label}</div>
        <div style={{ whiteSpace: "nowrap", display: "flex" }}>
          <Toggle
            active={isOn(this.props.toggled)}
            onClick={this.handleToggle}
            style={{ flex: 1, marginRight: 20 }}
          />
          <div style={{ flex: 1, marginTop: 10 }}>
            <ReactBootstrapSlider
              style={{ flex: 1, paddingTop: 8 }}
              value={this.props.value || 0}
              step={1}
              slideStop={this.handleSliderChange}
              min={1}
              max={100}
            />
          </div>
        </div>
      </div>
    );
  }
}

//
export default DimmerField;
