import React from "react";

class BlankTile extends React.Component {
  constructor(props) {
    super();
    this.size = props.size;
    this.tile = props.tile;
  }

  render() {
    return <div style={{ width: 128, height: 128 }}>{this.tile.device}</div>;
  }
}

//
export default BlankTile;
