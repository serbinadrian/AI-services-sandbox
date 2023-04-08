import React from "react";
import ReactDOM from "react-dom";
import { Provider as ReduxProvider } from "react-redux";
import SandboxApp from "./sandbox/SandboxApp";
import "./assets/style/icomoon.css";
import configureStore from "./Redux/Store";

export const store = configureStore();

ReactDOM.render(
  <ReduxProvider store={store}>
    <SandboxApp/>
  </ReduxProvider>,
  document.getElementById("root")
);
