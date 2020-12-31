import React from "react";
import { ListGroup } from "react-bootstrap";

const DevicesMenu = ({ devices, currentDevice, onSelect }) => {
  const devicesMap = {};

  for (const device of devices) {
    devicesMap[device.name] = device;
  }

  return (
    <ListGroup
      onSelect={(name) => {
        if (onSelect) {
          onSelect(devicesMap[name]);
        }
      }}
    >
      {devices.map((device) => {
        return (
          <ListGroup.Item 
            eventKey={device.name} 
            key={device.name}
            active={currentDevice.name === device.name}
          >
            {device.name}
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
};

//
export default DevicesMenu;
