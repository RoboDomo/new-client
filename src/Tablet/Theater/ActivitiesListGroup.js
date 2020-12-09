import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";

class ActivitiesListGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curentActivity: props.currentActivity,
    };
  }

  shouldComponentUpdate(newProps) {
    const ret = newProps.currentActivity !== this.state.currentActivity;
    if (this.state.currentActivity !== newProps.currentActivity) {
      this.setState({ currentActivity: newProps.currentActivity });
    }
    return ret;
  }

  render() {
    let key = 0;
    const currentActivity = this.state.currentActivity;

    return (
      <>
        <div style={{ fontWeight: "bold", textAlign: "center", fontSize: 12 }}>
          Activities
        </div>
        <ListGroup>
          {this.props.activities.map((activity) => {
            return (
              <ListGroupItem
                key={key++}
                style={{ fontWeight: "bold", textAlign: "center" }}
                /* variant={currentActivity === activity.name ? "success" : undefined} */
                active={currentActivity === activity.name}
                onClick={() => {
                  if (this.props.onClick) {
                    this.props.onClick(activity);
                  }
                }}
              >
                {activity.name}
              </ListGroupItem>
            );
          })}
        </ListGroup>
      </>
    );
  }
}

//
export default ActivitiesListGroup;
