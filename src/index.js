import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootswatch/dist/slate/bootstrap.min.css";
import "bootstrap-slider/dist/css/bootstrap-slider.css";
import "react-bootstrap-toggle/dist/bootstrap2-toggle.css";
import App from "./App";
import MQTT from "./lib/MQTT";
import { enableAutoTTS} from "enable-auto-tts";

import Say from "./lib/Say";
import Config from "./lib/Config";

const DEBUG = require("debug"),
  debug = DEBUG("index.js");

DEBUG.enable("MQTT");

localStorage.debug = "MQTT*";

enableAutoTTS();

const main = async () => {
  MQTT.on("connect", async () => {
    MQTT.subscribe("say", (topic, message) => {
      Say(message);
    });
    const config = new Config();
    config.registerChange(async (data) => {
      if (data) {
        debug("render");
        // await Say("Connected");
        // ReactDOM.render(
        //   <React.StrictMode>
        //     <App />
        //   </React.StrictMode>,
        //   document.getElementById("root")
        // );
        ReactDOM.render(<App />, document.getElementById("root"));
      }
    });
  });

  MQTT.on("error", () => {
    debug("error");
    // ReactDOM.render(
    //   <React.StrictMode>
    //     <h1>Network Error connecting to MQTT</h1>
    //   </React.StrictMode>,
    //   document.getElementById("root")
    // );
    ReactDOM.render(<App />, document.getElementById("root"));
  });

  MQTT.connect();
};

main();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
