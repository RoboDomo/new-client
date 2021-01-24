import React from "react";
import {
  Modal,
  Table,
  Form,
  ListGroup,
  ButtonGroup,
  Button,
} from "react-bootstrap";

class TiVoFavorites extends React.Component {
  constructor(props) {
    super();

    console.log("favorites props", props);

    this.hide = props.hide;
    this.select = props.select;
    this.tivo = props.tivo;
    this.channels = props.channels;
    this.activities = props.activities;
    this.state = { filter: "", display: "Favorites" };
    this.filterRef = React.createRef();
  }

  isFiltered(...args) {
    const filter = this.state.filter;
    if (filter === "") {
      return false;
    }
    const re = new RegExp(this.state.filter.toUpperCase());
    console.log("isFiltered", filter, re, ...args);

    for (const arg of args) {
      if (re.test(arg.toUpperCase())) {
        return false;
      }
    }

    return true;
  }

  renderFilterField() {
    return (
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          this.filterRef.current.blur();
        }}
      >
        <Form.Control
          value={this.state.filter}
          ref={this.filterRef}
          placeholder="Filter"
          type="text"
          onChange={(...args) => {
            this.setState({ filter: this.filterRef.current.value });
            /* console.log("CHANGE", this.filterRef.current.value, ...args); */
          }}
        />
      </Form>
    );
  }

  renderFavorites() {
    if (this.state.display !== "Favorites" || !this.tivo.favorites) {
      return null;
    }
    let key = 0;
    const channels = this.channels;

    return (
      <>
        {this.renderFilterField()}
        <div style={{ height: 400, overflow: "auto" }}>
          <Table striped>
            <tbody>
              {this.tivo.favorites.map((favorite) => {
                if (this.isFiltered(favorite.name, favorite.channel)) {
                  return null;
                }
                return (
                  <tr
                    key={++key}
                    onClick={() => {
                      if (this.select) {
                        this.select({ type: "favorite", favorite: favorite });
                      }
                    }}
                  >
                    <td>
                      <img
                        src={channels[favorite.channel].logo.URL}
                        style={{ width: 60 }}
                        alt="logo"
                      />
                    </td>
                    <td style={{ fontSize: 24 }}>{favorite.name}</td>
                    <td style={{ fontSize: 24 }}>{favorite.channel}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </>
    );
  }

  renderActivities() {
    if (this.state.display !== "Activities") {
      return null;
    }
    // const curentActivity = this.props.currentActivity;
    let key = 0;
    return (
      <ListGroup>
        {this.activities.map((activity) => {
          return (
            <ListGroup.Item
              key={++key}
              variant={
                this.props.currentActivity.name === activity.name
                  ? "success"
                  : undefined
              }
              onClick={() => {
                if (this.select) {
                  this.select({ type: "activity", activity: activity });
                }
              }}
            >
              {activity.name}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    );
  }

  renderActivitiesx() {
    if (this.state.display !== "Activities") {
      return null;
    }
    return (
      <ButtonGroup vertical style={{ width: "100%" }}>
        {this.activities.map((activity) => {
          return (
            <Button
              size="lg"
              block
              onClick={() => {
                if (this.select) {
                  this.select({ type: "activity", activity: activity });
                }
              }}
            >
              {activity.name}
            </Button>
          );
        })}
      </ButtonGroup>
    );
  }

  renderChannels() {
    if (this.state.display !== "Channels") {
      return null;
    }

    const channels = this.channels;
    let key = 0;

    const renderLogo = (channel) => {
      if (channel.logo) {
        return <img src={channel.logo.URL} style={{ width: 60 }} alt="logo" />;
      }
      return "";
    };

    return (
      <>
        {this.renderFilterField()}
        <div style={{ height: 400, overflow: "auto" }}>
          <Table striped>
            <tbody>
              {Object.keys(channels)
                .sort((a, b) => {
                  return a - b;
                })
                .map((ndx) => {
                  const channel = channels[ndx];
                  if (this.isFiltered(ndx, channel.callsign, channel.name)) {
                    return null;
                  }

                  return (
                    <tr
                      key={++key}
                      onClick={() => {
                        if (this.select) {
                          this.select({
                            type: "favorite",
                            favorite: { name: channel.name, channel: ndx },
                          });
                        }
                      }}
                    >
                      <td>{renderLogo(channel)}</td>
                      <td style={{ fontSize: 24 }}>{channel.name}</td>
                      <td style={{ fontSize: 24 }}>{ndx}</td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      </>
    );
  }
  renderChooserRadios() {
    return (
      <ButtonGroup size="sm" style={{ marginLeft: 40 }}>
        <Button
          variant={this.state.display === "Favorites" ? "success" : undefined}
          onClick={() => {
            this.setState({ display: "Favorites" });
          }}
        >
          Favorites
        </Button>
        <Button
          variant={this.state.display === "Channels" ? "success" : undefined}
          onClick={() => {
            this.setState({ display: "Channels" });
          }}
        >
          Channels
        </Button>
      </ButtonGroup>
    );
  }
  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={() => {
          if (this.hide) {
            this.hide();
          }
        }}
      >
        <Modal.Header>
          <Modal.Title
            onClick={() => {
              switch (this.state.display) {
                case "Favorites":
                  this.setState({ display: "Channels" });
                  break;
                case "Channels":
                  this.setState({ display: "Activities" });
                  break;
                default:
                  this.setState({ display: "Favorites" });
                  break;
              }
            }}
          >
            <div style={{ width: 128 }}>{this.state.display}</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderActivities()}
          {this.renderFavorites()}
          {this.renderChannels()}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              if (this.hide) {
                this.hide();
              }
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

//
export default TiVoFavorites;
