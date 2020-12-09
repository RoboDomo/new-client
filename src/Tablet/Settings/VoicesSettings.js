import React from "react";
import {Table} from "react-bootstrap";

class VoicesSettings extends React.Component {
  render() {
    const voices = speechSynthesis.getVoices(),
      vmap = voices.map((e) => e),
      sorted = vmap.sort((a, b) => {
        return a.lang.localeCompare(b.lang);
      });

    let key = 0;
    return (
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Language</th>
            <th>Default</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((voice) => {
            return (
              <tr key={++key}>
                <td>{voice.name}</td>
                <td>{voice.lang}</td>
                <td>{voice.default ? "YES" : ""}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
}

//
export default VoicesSettings;
