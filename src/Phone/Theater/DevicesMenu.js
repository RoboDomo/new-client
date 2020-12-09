import React from "react";
import { ButtonGroup, Button, Dropdown } from "react-bootstrap";

const DevicesMenu = ({ devices, currentDevice, onSelect }) => {
  const devicesMap = {};

  for (const device of devices) {
    devicesMap[device.name] = devices;
  }

  console.log("currentDevice", currentDevice);
  const name = currentDevice ? currentDevice.name : "None";
  return (
    <Dropdown
      as={ButtonGroup}
      alignRight={true}
      navbar={true}
      onSelect={(newDevice, e) => {
        console.log("onSelect newDevice", newDevice, devicesMap[newDevice]);
        if (onSelect) {
          onSelect(newDevice);
        }
      }}
    >
      <Button variant="primary">{name}</Button>
      <Dropdown.Toggle split variant="primary">
        <Dropdown.Menu>
          {devices.map(device => {
            return (
              <Dropdown.Item eventKey={device.name} key={device.name}>
                {device.name}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown.Toggle>
    </Dropdown>
  );
};

//
export default DevicesMenu;
