import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import MQTT from "lib/MQTT";
import { data as Config } from "lib/Config";

class SensorsTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.sensors = {};

    this.handleSensorMessage = this.handleSensorMessage.bind(this);
  }

  handleSensorMessage(topic, message) {
    const parts = topic.split("/"),
      type = parts.pop(),
      name = parts[1];

    // console.log("hendleMessage", name, type, message);
    if (!this.sensors[type]) {
      console.log("invalid sensor ", name, type, message);
      return;
    }
    this.sensors[type][name].value = message;
    this.sensors[type][name].formatted = message;
    this.setState({sensors: this.sensors});
  }

  componentDidMount() {
    for (const sensor of Config.sensors) {
      const type = sensor.type,
        hub = sensor.source;
      this.sensors[type] = this.sensors[type] || {};
      this.sensors[type][sensor.name] = sensor;
      if (hub === "smartthings") {
        MQTT.subscribe(
          `${hub}/${sensor.name}/${type}`,
          this.handleSensorMessage
        );
      } else {
        MQTT.subscribe(
          `${hub}/${sensor.name}/status/${type}`,
          this.handleSensorMessage
        );
      }
    }
  }

  componentWillUnmount() {
    for (const sensor of Config.sensors) {
      const type = sensor.type,
        hub = sensor.source;

      if (hub === "smartthings") {
        MQTT.unsubscribe(
          `${hub}/${sensor.name}/${type}`,
          this.handleSensorMessage
        );
      } else {
        MQTT.unsubscribe(
          `${hub}/${sensor.name}/status/${type}`,
          this.handleSensorMessage
        );
      }
    }
  }

  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\
  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\
  //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\ //\\//\\

  render() {
    if (!this.state.sensors) {
      return null;
    }
    const metric = Config.metric;

    //
    const renderType = (type) => {
      let key = 0;

      const m = [],
            h = this.sensors[type];

      // console.log(type, h);

      for (const s of Object.keys(h)) {
        m.push(h[s]);
      }

      return m.map((sensor) => {
        if (!sensor) {
          return null;
        }

        return (
          <div key={"type" + key++}>
            {sensor.name}
            <span style={{ float: "right" }}>
              {metric && sensor.metric ? sensor.metric : sensor.formatted}
            </span>
          </div>
        );
      });
    };

    //
    const renderCard = (type) => {
      return (
        <Col sm={4} style={{ marginTop: 20 }}>
          <Card>
            <Card.Header>{type.toUpperCase()}</Card.Header>
            <Card.Body>{renderType(type)}</Card.Body>
          </Card>
        </Col>
      );
    };


    //
    console.log("Render SensorsTab");
    return (
      <div style={{ padding: 20, marginTop: 10 }}>
        <Row>
          {renderCard("contact")}
          {renderCard("motion")}
          {renderCard("battery")}
        </Row>
        <Row>
          {renderCard("temperature")}
          {renderCard("illuminance")}
          {renderCard("humidity")}
        </Row>
      </div>
    );
  }
}

//
export default SensorsTab;
