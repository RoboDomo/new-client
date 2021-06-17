import React from "react";
import { Table, Button, ButtonGroup } from "react-bootstrap";
import Logger from "lib/Logger";
import YesNoModal from 'Common/Modals/YesNoModal';

class AlertsTab extends React.Component {
  constructor(props) {
    super(props);
    this.type = props.type;
    this.state = {
      modal: false
    };

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
    console.log("render");
    const history = Logger.history("alerts");
    let key = 0;

    const renderHistory = () => {
      return history.reverse().map((packet) => {
        if (this.type === "all" || this.type === packet.type) {
          const time = new Date(packet.timestamp).toLocaleString();
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
          }
        }
        return null;
      });
    };

    const renderToolbar = () => {
      return (
        <ButtonGroup style={{marginLeft: 400, marginBottom: 10, width: '20%', textAlign: 'center'}}>
          <Button
            variant="danger"
            onClick={() => {
              this.setState({ modal: true});
            }}
          >
            Clear {this.type} history
          </Button>
        </ButtonGroup>
      );
    };

    return (
      <>
        <YesNoModal
          show={this.state.modal}
          title="Clear History"
          question={`Clear ${this.type} history?`}
          onSelect={(button) => {
            this.setState({ modal: false });
            if (button) {
              Logger.clear("alerts");
              /* this.setState({ selected: "Alerts" }); */
            }
          }}
        />
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
export default AlertsTab;
