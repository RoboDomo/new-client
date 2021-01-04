import React from "react";
import { Button } from "react-bootstrap";

class Exception extends React.Component {
  constructor(props) {
    super();
    this.exception = props.exception;
  }

  render() {
    return (
      <div>
        <h1>Exception</h1>
        <Button
          onClick={() => {
            window.reload();
          }}
        >
          Reload();
        </Button>
        <pre>{this.exception.toString()}</pre>
      </div>
    );
  }
}

//
export default Exception;
