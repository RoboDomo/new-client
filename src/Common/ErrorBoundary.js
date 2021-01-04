import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super();
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true, info: info });
    // You can also log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <>
          <h1>Something went wrong.</h1>
          <pre>{this.state.info.toString()}</pre>
        </>
      );
    }
    return this.props.children;
  }
}

//
export default ErrorBoundary;
