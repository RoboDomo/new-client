import React from "react";
import { Table, Button, ButtonGroup } from "react-bootstrap";
import Logger from "lib/Logger";

class AlertsSettings extends React.Component {
  constructor(props) {
    super(props);
    //
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(type, value) {
    switch (type) {
      case "alerts":
        this.setState({ alerts: value });
        break;
      case "warnings":
        this.setState({ warnings: value });
        break;
      default:
        break;
    }
  }

  componentDidMount() {
    Logger.on("change", this.handleChange);
  }

  compoonentWillUnmount() {
    Logger.un("change", this.handleChange);
  }

  render(props) {
    const history = Logger.history("alerts");
    let key = 0;

    const renderHistory = () => {
      return history.reverse().map((packet) => {
        const time = new Date(packet.timestamp).toLocaleString();
        // console.log("packet", packet, time);
        try {
          return (
            <tr key={++key}>
              <td style={{ whiteSpace: "nowrap" }}>{time}</td>
              <td> {packet.type}</td>
              <td>{packet.message.join(" ")}</td>
            </tr>
          );
        } catch (e) {
          console.log("Exception e", e);
          console.log("packet", packet);
          return null;
        }
      });
    };

    const renderToolbar = () => {
      return (
        <ButtonGroup>
          <Button
            onClick={() => {
              Logger.clear("alerts");
              this.setState({ selected: "Alerts" });
            }}
          >
            Clear
          </Button>
        </ButtonGroup>
      );
    };

    return (
      <>
        {renderToolbar()}
        <Table striped>
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>{renderHistory()}</tbody>
        </Table>
      </>
    );
  }
}

//
export default AlertsSettings;
