import React from "react";
import {data as Config} from "lib/Config";
import Locale from "lib/Locale";

const val = n => {
  return parseInt(n * 10) / 10;
};

// sometimes you want a metric value even if the app is not displaying metric in general
const Temperature = ({ value, units = true, metric = false }) => {
  const isMetric = metric || Config.metric;

  if (isMetric) {
    return (
      <>
        {val(Locale.ftoc(value, isMetric))}
        {units ? <span>&deg;C</span> : null}
      </>
    );
  } else {
    return (
      <>
        {val(value)}
        {units ? <span>&deg;F</span> : null}
      </>
    );
  }
};

//
export default Temperature;
