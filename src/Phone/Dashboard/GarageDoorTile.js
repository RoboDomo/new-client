import React from "react";

import { GiHomeGarage } from "react-icons/gi";

class GarageDoorTile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <GiHomeGarage
          style={{ marginTop: -4, marginLeft: 6, marginRight: 8, fontSize: 24 }}
        />
        Garage Door is closed.
      </div>
    );
  }
}

//
export default GarageDoorTile;
