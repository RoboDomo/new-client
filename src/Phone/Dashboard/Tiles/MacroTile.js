import React from "react";

import { VscRunAll } from "react-icons/vsc";

class MacroTile extends React.Component {
  constructor(props) {
    super(props);
    this.name = props.tile.name;
    this.label = props.tile.label;
  }

  render() {
    return (
      <div>
        <VscRunAll
          style={{ marginTop: -4, marginLeft: 6, marginRight: 8, fontSize: 24 }}
        />
        {this.label}
      </div>
    );
  }
}

//
export default MacroTile;
