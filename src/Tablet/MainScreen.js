import React from "react";
import NavBar from "./NavBar";


class MainScreen extends React.Component {
  constructor() {
    super();
    document.body.classList.add("tablet");
  }


  render() {
    return (
      <div style={{width: "100%", height: "100%"}}>
        <div
          style={{
            width: 1024,
            height: 768 - 20,
            margin: "auto",
            border: "1px solid green",
          }}
        >
          <div style={{marginTop: 56}}>
            <NavBar />
          </div>
        </div>
      </div>
    );
  }
}

//
export default MainScreen;
