import React, { Component } from "react";
import "./App.css";
import { HashRouter, Route } from "react-router-dom";

import Admin from "./admin/Admin.jsx";
import Rfid from "./rfid/rfid.jsx";

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Route exact path="/" component={Rfid} />
        <Route path="/admin" component={Admin} />
      </HashRouter>
    );
  }
}

export default App;
