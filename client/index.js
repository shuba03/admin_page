import React from "react";
import ReactDOM from "react-dom";
import App from "./pages/app";

import { ToastContainer } from 'react-toastify';

import "./assets/css/responsive.css";
import "react-toastify/dist/ReactToastify.css";


ReactDOM.render(
  <React.StrictMode>
    <App />
    <ToastContainer />
  </React.StrictMode>,
  document.getElementById("root")
);
