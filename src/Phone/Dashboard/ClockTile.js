import React from "react";
import Clock from "Common/Clock";

class ClockTile extends React.Component {
  constructor(props) {
    super(props);
    super(props);
    // this.style = styles.tile(2, 2);
    this.state = {
      date: new Date(),
      weather: null,
    };

    this.handleWeather = this.handleWeather.bind(this);
  }

  render() {
    const d = new Date();
    return (
      <div style={{fontSize: 32}}>
        {d.toLocaleDateString()}
        <div className="float-right">
          <Clock className="float-right" />
        </div>
      </div>
    );
  }
}

//
export default ClockTile;
