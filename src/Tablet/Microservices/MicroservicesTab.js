import React from "react";
import { data as Config } from "lib/Config";

import MQTT from "lib/MQTT";

import { Table, Row, Col, ButtonGroup, Button } from "react-bootstrap";

import { VscDebugRestart } from "react-icons/vsc";

class MicroservicesTab extends React.Component {
  constructor(props) {
    super(props);
    this.display = props.display || "table";
    this.type = props.type || "All";
  }

  render() {
    switch (this.props.display) {
      case "table":
        return this.renderTable();
      default:
        return this.renderColumns();
    }
  }

  renderColumns() {
    const cols = Config.microservices.types.length;
    let key = 1;

    const renderRestartButton = (title) => {
      return (
        <Button key={++key} style={{ marginBottom: 8 }}>
          <div className="float-left">
            <VscDebugRestart style={{ marginRight: 10 }} />
            <span>{title}</span>
          </div>
        </Button>
      );
    };

    const renderColumn = (type) => {
      return (
        <Col xs={12 / cols} key={++key}>
          <ButtonGroup vertical>
            {Config.microservices.services.map((service) => {
              if (service.type !== type) {
                return null;
              }
              return renderRestartButton(service.title, service.name);
            })}
          </ButtonGroup>
        </Col>
      );
    };
    return (
      <Row>
        {Config.microservices.types.map((type) => {
          return renderColumn(type);
        })}
      </Row>
    );
  }

  renderTable() {
    let key = 1;
    return (
      <>
        <Table striped style={{ marginTop: 4 }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              {/* <th>Docker Name</th> */}
              <th>Type</th>
              <th>Restart</th>
            </tr>
          </thead>
          <tbody>
            {Config.microservices.services.map((service) => {
              /* console.log('service', service, this.type); */
              if (service.type === this.type || this.type === "All") {
                return (
                  <tr key={++key}>
                    <td style={{ verticalAlign: "middle" }}>{service.title}</td>
                    <td style={{ verticalAlign: "middle" }}>
                      {service.description}
                    </td>
                    <td style={{ verticalAlign: "middle" }}>{service.type}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          MQTT.publish(
                            `${service.mqtt}/reset/set/command`,
                            "__RESTART__"
                          );
                        }}
                      >
                        <VscDebugRestart style={{ marginRight: 10 }} />
                      </Button>
                    </td>
                  </tr>
                );
              } else {
                return null;
              }
            })}
          </tbody>
        </Table>
      </>
    );
  }
}

//
export default MicroservicesTab;
