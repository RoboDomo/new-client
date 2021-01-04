import React, { lazy, Suspense } from "react";
import ErrorBoundary from "Common/ErrorBoundary";

import bowser from "bowser";
import Alert from "Common/Alert";

// import MainScreen from './Tablet/MainScreen';

const parser = bowser.getParser(window.navigator.userAgent),
  platform = parser.getResult().platform;

const Tablet = lazy(() =>
  import(
    "./Tablet/MainScreen" /* webpackChunkName: "tablet", webpackPrefetch: true  */
  )
);
const Phone = lazy(() =>
  import(
    "./Phone/MainScreen" /* webpackChunkName: "phone", webpackPrefetch: true  */
  )
);

// const Portrait = lazy(() =>
//   import(
//     "./Portrait/MainScreen" /* webpackChunkName: "portrait", webpackPrefetch: true  */
//   )
// );

const Platform = () => {
  if (platform.type === "mobile") {
    return (
      <ErrorBoundary>
        <Alert />
        <Phone />
      </ErrorBoundary>
    );
  }
  // if (window.orientation === 0) {
  //   return <Portrait />;
  // }
  return (
    <ErrorBoundary>
      <Alert />
      <Tablet />
    </ErrorBoundary>
  );
};

function App() {
  // console.log(platform, "orientation", window.orientation);
  return (
    <Suspense fallback={<div className="loader" />}>
      <Platform />
    </Suspense>
  );
}

//
export default App;
