import React from "react";

import { Navbar } from "react-bootstrap";

import Theater from "Portrait/Theater";

class MainScreen extends React.Component {
  constructor(props) {
    super();
    this.state = {};
  }

  render() {
    return (
      <>
        <Navbar fixed="top" bg="primary" variant="dark">
          <Navbar.Brand
            onClick={() => {
              window.location.reload();
            }}
          >
            RoboDomo
          </Navbar.Brand>
        </Navbar>
        <div style={{ marginTop: 60 }}>
          <Theater />
        </div>
      </>
    );
  }
}

//
export default MainScreen;
