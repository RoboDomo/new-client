import React from "react";
import { ListGroup } from "react-bootstrap";

const ActivitiesMenu = ({ activities, currentActivity, onSelect }) => {
  const activitiesMap = {};

  for (const activity of activities) {
    activitiesMap[activity.name] = activity;
  }

  return (
    <ListGroup
      onSelect={(name, ...args) => {
        if (onSelect) {
          console.log("onSelect name ", name, activitiesMap[name]);
          onSelect(activitiesMap[name], ...args);
        }
      }}
    >
      {activities.map((activity) => {
        //            console.log("activity", activity);
        return (
          <ListGroup.Item
            key={activity.name}
            eventKey={activity.name}
            active={activity.name === currentActivity.name}
          >
            {activity.name}
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
};

export default ActivitiesMenu;
