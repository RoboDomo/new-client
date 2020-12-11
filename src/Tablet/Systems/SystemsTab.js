import React from "react";
import { Table } from "react-bootstrap";
import MQTT from "lib/MQTT";
import {
  getElapsed, //
  // formatMB, //
  formatGB, //
  pct,
} from "lib/Utils";

const subscriptions = [
  "loadavg",
  "interfaces",
  "cpus",
  "system",
  "uptime",
  "memory",
  "disks",
  "systemTime",
];

class SystemsTab extends React.Component {
  constructor(props) {
    super(props);
    this.system = props.system;
    this.state = {};
    this.cpus = null; // last seen
    //
    this.handleMessage = this.handleMessage.bind(this);
  }

  handleMessage(topic, message) {
    const parts = topic.split("/"),
      what = parts.pop();

    const newState = {};
    newState[what] = message;
    this.setState(newState);
    // if (what === "cpus") {
    //   console.log("cpus", message[0].times);
    // }
  }

  componentDidMount() {
    for (const topic of subscriptions) {
      MQTT.subscribe(
        `sysinfo/${this.system}/status/${topic}`,
        this.handleMessage
      );
    }
  }

  componentWillUnmount() {
    for (const topic of subscriptions) {
      MQTT.unsubscribe(
        `sysinfo/${this.system}/status/${topic}`,
        this.handleMessage
      );
    }
  }

  renderSystem() {
    const { system, loadavg, uptime, systemTime } = this.state;

    if (!system || !loadavg || !uptime || !systemTime) {
      return null;
    }

    return (
      <>
        <h1>{system.hostname}</h1>
        <div>
          {new Date(systemTime).toLocaleTimeString()} up{" "}
          {getElapsed(uptime).uptime}, load average: {loadavg.join(" ")}
        </div>
        <Table>
          <thead>
            <tr>
              <th>Arch</th>
              <th>Platform</th>
              <th>Release</th>
              <th>Version</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{system.arch}</td>
              <td>{system.platform}</td>
              <td>{system.release}</td>
              <td>{system.version}</td>
            </tr>
          </tbody>
        </Table>
      </>
    );
  }

  //
  //
  //
  renderCpus() {
    const { cpus } = this.state;
    if (!cpus) {
      return null;
    }

    if (!this.cpus) {
      this.cpus = cpus;
    }

    // console.log("xcpu0", cpus[0].times);
    // console.log("cpu0", this.cpus[0].times);
    let key = 0;
    const ret = (
      <>
        <h1>CPUs</h1>
        <Table>
          <thead>
            <tr>
              <th>Number</th>
              <th>Model</th>
              <th>Speed</th>
              <th>Idle</th>
              <th>IRQ</th>
              <th>nice</th>
              <th>sys</th>
              <th>user</th>
            </tr>
          </thead>
          <tbody>
            {cpus.map((cpu, num) => {
              const t = cpu.times;
              const total = t.idle + t.irq + t.nice + t.sys + t.user;
              const other = this.cpus[num];
              const ot = other.times;
              const ototal = ot.idle + ot.irq + ot.nice + ot.sys + ot.user;
              const tt = total - ototal;

              return (
                <tr key={++key}>
                  <td>{num}</td>
                  <td>{cpu.model}</td>
                  <td>{cpu.speed}</td>
                  <td>{pct((cpu.times.idle - other.times.idle) / tt)}%</td>
                  <td>{pct((cpu.times.irq - other.times.irq) / tt)}%</td>
                  <td>{pct((cpu.times.nice - other.times.nice) / tt)}%</td>
                  <td>{pct((cpu.times.sys - other.times.sys) / tt)}%</td>
                  <td>{pct((cpu.times.user - other.times.user) / tt)}%</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </>
    );

    // this.cpus = cpus;
    return ret;
  }

  renderInterfaces() {
    const { interfaces } = this.state;
    if (!interfaces) {
      return null;
    }

    const ifaces = [];
    for (const key of Object.keys(interfaces)) {
      const iface = interfaces[key];
      for (const i of iface) {
        if (i.family === "IPv4") {
          ifaces.push({
            name: key,
            address: i.address,
            cidr: i.cidr,
            mac: i.mac,
            netmask: i.netmask,
          });
        }
      }
    }

    let key = 0;
    return (
      <Table>
        <thead>
          <tr>
            <th>Interface</th>
            <th>address</th>
            <th>netmask</th>
            <th>cidr</th>
            <th>mac</th>
          </tr>
        </thead>
        <tbody>
          {ifaces.map((iface) => {
            if (iface.name.indexOf("docker") === 0 || iface.name === "lo") {
              return null;
            }
            return (
              <tr key={++key}>
                <td>{iface.name}</td>
                <td>{iface.address}</td>
                <td>{iface.netmask}</td>
                <td>{iface.cidr}</td>
                <td>{iface.mac}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }

  renderMounts() {
    const { disks } = this.state;
    if (!disks) {
      return null;
    }

    let key = 0;
    return (
      <>
        <h1>File Systems</h1>
        <Table>
          <thead>
            <tr>
              <th>Mount Point</th>
              <th>File System</th>
              <th>Total</th>
              <th>Used</th>
              <th>Avaiable</th>
              <th>Capacity</th>
            </tr>
          </thead>
          <tbody>
            {disks.map((mount) => {
              if (
                mount._filesystem === "tmpfs" ||
                mount._filesystem === "shm" ||
                mount._mounted === "/etc/hosts"
              ) {
                return null;
              }
              return (
                <tr key={++key}>
                  <td>{mount._mounted}</td>
                  <td>{mount._filesystem}</td>
                  <td>{formatGB(mount._blocks * 1024)}</td>
                  <td>{formatGB(mount._used * 1024)}</td>
                  <td>{formatGB(mount._available * 1024)}</td>
                  <td>{mount._capacity}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </>
    );
  }

  renderMemory() {
    const { memory } = this.state;
    if (!memory) {
      return null;
    }

    const used = memory.total - memory.free;
    return (
      <>
        <h1>Memory</h1>
        <Table>
          <thead>
            <tr>
              <th>Total</th>
              <th>Used</th>
              <th>Free</th>
              <th>% Used</th>
              <th>% Free</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{formatGB(memory.total)}</td>
              <td>{formatGB(used)}</td>
              <td>{formatGB(memory.free)}</td>
              <td>{pct(used / memory.total)}</td>
              <td>{pct(memory.free / memory.total)}</td>
            </tr>
          </tbody>
        </Table>
      </>
    );
  }
  // memory
  render() {
    return (
      <div style={{ overflow: "scroll", height: "100vh", paddingBottom: 300 }}>
        {this.renderSystem()}
        {this.renderMemory()}
        {this.renderCpus()}
        <h1>Interfaces</h1>
        {this.renderInterfaces()}
        {this.renderMounts()}
      </div>
    );
  }
}

//
export default SystemsTab;
