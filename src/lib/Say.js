// TODO: queue texts to speak?

import Logger from "lib/Logger";
import MQTT from "lib/MQTT";

const ENABLED = true;

class Speak {
  constructor() {
    this.lastMessage = null;
    this.voices = null;
    this.voice = null;

    this.interval = null;
    this.queue = [];
    this.start();
  }

  async sayit(message) {
    if (!ENABLED) {
      return;
    }
    // honor mute button on the top bar
    const muteSpeech = localStorage.getItem("mute-speech") || "false";
    if (muteSpeech === "false") {
      const u = new SpeechSynthesisUtterance(message);
      if (!this.voices) {
        this.voices = speechSynthesis.getVoices();
        if (this.voices.length) {
          this.voice = this.voices[0];
        }
        for (const voice of this.voices) {
          if (voice.lang !== "en-US") {
            continue;
          }
          const v = {};
          for (const key in voice) {
            v[key] = voice[key];
          }
          const vv = JSON.stringify(v);
          Logger.alert(vv);
          this.voice = voice;
          if (voice.default) {
            break;
          }
        }
      }

      if (this.voice) {
        u.voice = this.voice;
      }

      u.lang = "en-US";
      u.volume = 1;
      u.rate = 0.75;
      try {
        // debugger
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
      } catch (e) {
        console.log("Say exception", e);
      }
    }
  }

  async say(message) {
    if (!ENABLED) {
      return;
    }
    this.queue.unshift(message);
  }

  start() {
    this.interval = setInterval(async () => {
      if (!speechSynthesis.speaking) {
        const message = this.queue.pop();
        if (message && message !== this.lastMessage) {
          await this.sayit(message);
        }
        this.lastMessage = message;
      }
    }, 1000);
  }
}

//
const speaker = new Speak();

const say = async (message) => {
  if (!ENABLED) {
    return;
  }
  await speaker.say(message);
};

if (ENABLED) {
  let interval = setInterval(async () => {
    try {
      if (
        MQTT.subscribe(
          "say",
          async (topic, message) => {
            await say(message);
          },
          10
        )
      ) {
        clearInterval(interval);
      }
    } catch (e) {
      console.log("Say retry");
    }
  }, 1000);
}

//
export default say;
