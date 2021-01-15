import React from "react";
import { data as Config } from "lib/Config";

import MQTT from "lib/MQTT";

import { Table, Row, Col, ButtonGroup, Button } from "react-bootstrap";

import { VscDebugRestart } from "react-icons/vsc";

class MicroservicesSettings extends React.Component {
  constructor(props) {
    super(props);
    this.type = props.type || "table";
  }

  render() {
    switch (this.props.type) {
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
        <div style={{ textAlign: "center" }}>
          <Button
            style={{
              marginRight: "auto",
              marginLeft: "auto",
              marginTop: 8,
              marginBottom: 8,
            }}
            variant="danger"
            size="sm"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            Clear localStorage
          </Button>
        </div>
        <Table striped>
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
              /* console.log("service", service); */
              return (
                <tr key={++key}>
                  <td style={{ verticalAlign: "middle" }}>{service.title}</td>
                  <td style={{ verticalAlign: "middle" }}>
                    {service.description}
                  </td>
                  {/* <td style={{verticalAlign: "middle"}}>{service.name}</td> */}
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
            })}
          </tbody>
        </Table>
      </>
    );
  }
}

//
export default MicroservicesSettings;
