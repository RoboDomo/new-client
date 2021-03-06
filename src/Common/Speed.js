import React from "react";
// import useConfig from "@/hooks/useConfig";
import Locale from "lib/Locale";

import { data as Config } from "lib/Config";

const val = n => {
  return parseInt(n * 10) / 10;
};

const Speed = ({ value, units = true, metric = false }) => {
  const isMetric = metric || Config.metric;
  if (isMetric) {
    return (
      <>
        {val(Locale.mphtokph(value, isMetric))}
        {units ? <span> km/h</span> : null}
      </>
    );
  } else {
    return (
      <>
        {val(value)}
        {units ? <span> MPH</span> : null}
      </>
    );
  }
};

//
export default Speed;
