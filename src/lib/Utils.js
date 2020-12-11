/**
 * mangle(name)
 *
 * Returns name with spaces removed, converted to uppercase, etc.
 *
 * Useful for comparing something like "hdmi1" and "HDMI 1"
 */
const mangle = (name) => {
  if (!name) {
    return "UNDEFINED!";
  }

  return name //
    .replace(/ /g, "")
    .toUpperCase();
};

/**
 * mangleComparef(name1, name2);
 * returns true if mangled name1 equals mangled name2
 */
const mangleCompare = (name1, name2) => {
  return mangle(name1) === mangle(name2);
};

const formatElapsedTime = (seconds, trim = true) => {
  const d = new Date(null);
  d.setSeconds(seconds);
  const formatted = d.toISOString().substr(11, 8);
  if (trim && formatted.substr(0, 3) === "00:") {
    return formatted.substr(3);
  } else {
    return formatted;
  }
};

const isOn = (m) => {
  if (m === true || m === false) {
    return m;
  }
  if (m) {
    m = m.toLowerCase();
  }
  return m === "true" || m === "on" || m === "enabled" || m === "Locked";
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// convert time in seconds to { days: days, hours: hours, minutes: minutes, seconds: seconds }
const getElapsed = (time) => {
  const ret = {};
  const leadZero = (n) => {
    if (n <= 9) {
      return "0" + n;
    }
    return n;
  };

  ret.days = Math.floor(time / 86400);
  time -= ret.days * 86400;

  ret.hours = Math.floor(time / 3600) % 24;
  time -= ret.hours * 3600;

  ret.minutes = Math.floor(time / 60) % 60;
  time -= ret.minutes * 60;

  ret.seconds = time % 60;

  ret.formatted = "";
  if (ret.days) {
    ret.formatted += `${ret.days} days, `;
  }

  ret.uptime = ret.formatted + `${ret.hours}:${leadZero(ret.minutes)}`;
  ret.formatted += `${ret.hours} hours, ${leadZero(
    ret.minutes
  )} minutes, ${leadZero(ret.seconds)} seconds`;

  return ret;
};

// formatting routines
const pct = (v, decimalPlaces = 2) => {
  return (v * 100).toFixed(decimalPlaces);
};

const formatMB = (n) => {
  return (n / (1024 * 1024)).toFixed(2) + " MB";
};

const formatGB = (n) => {
  return (n / (1024 * 1024 * 1024)).toFixed(2) + " GB";
};

//
export {
  mangle, //
  mangleCompare, //
  formatElapsedTime, //
  isOn, //
  sleep, //
  getElapsed, //
  pct,
  formatMB,
  formatGB,
};
