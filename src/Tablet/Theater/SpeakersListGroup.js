import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import MQTT from "lib/MQTT";

class SpeakersListGroup extends React.Component {
  constructor(props) {
    super(props);
    this.tv = props.tv;
    this.avr = props.avr;
    this.state = {
      speakers: "speakers",
    };

    this.handleSpeakersMessage = this.handleSpeakersMessage.bind(this);
  }

  handleSpeakersMessage(topic, message) {
    this.setState({ speakers: message });
  }

  componentDidMount() {
    if (this.tv.type !== "bravia") {
      return;
    }
    MQTT.subscribe(
      `bravia/${this.tv.device}/status/speakers`,
      this.handleSpeakersMessage
    );
  }

  componentWillUnmount() {
    if (this.tv.type !== "bravia") {
      return;
    }
    MQTT.unsubscribe(
      `bravia/${this.tv.device}/status/speakers`,
      this.handleSpeakersMessage
    );
  }

  render() {
    if (!this.tv || !this.avr || this.tv.type !== "bravia") {
      return null;
    }

    return (
      <>
        <div style={{ fontWeight: "bold", textAlign: "center", fontSize:18 }}>
          Speakers
        </div>
        <ListGroup>
          <ListGroupItem
            active={this.state.speakers==="speaker"}
            onClick={() => {
              MQTT.publish(`bravia/${this.tv.device}/set/command`, "SPEAKERS");
            }}
          >
            TV Speakers
          </ListGroupItem>
          <ListGroupItem
            active={this.state.speakers==="audioSystem"}
            onClick={() => {
              MQTT.publish(`bravia/${this.tv.device}/set/command`, "AUDIOSYSTEM");
            }}
          >
            Audio System
          </ListGroupItem>
        </ListGroup>
      </>
    );
  }
}

//
export default SpeakersListGroup;
