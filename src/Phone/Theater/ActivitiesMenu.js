import React from "react";
import { ButtonGroup, Button, Dropdown } from "react-bootstrap";

const ActivitiesMenu = ({ activities, currentActivity }) => {
  console.log("activities", activities);
  console.log("currentActivity", currentActivity.name);

  const activitiesMap = {};

  for (const activity of activities) {
    activitiesMap[activity.name] = activities;
  }

  // return (
  //   <div>
  //     CurrentActivity {currentActivity.name}
  //   </div>
  // );
  return (
    <Dropdown
      as={ButtonGroup}
      alignRight={true}
      navbar={true}
      onSelect={(newActivity, e) => {
        console.log("onSelect newActivity", newActivity, activitiesMap[newActivity]);
      }}
    >
      <Button variant="primary">{currentActivity.name}</Button>
      <Dropdown.Toggle split variant="primary">
        <Dropdown.Menu>
          {activities.map(activity => {
            //            console.log("activity", activity);
            return (
              <Dropdown.Item key={activity.name} eventKey={activity.name}>
                {activity.name}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown.Toggle>
    </Dropdown>
  );
};

export default ActivitiesMenu;
