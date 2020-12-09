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

//
export {
  mangle, //
  mangleCompare, //
  formatElapsedTime, //
  isOn, //
  sleep, //
};
