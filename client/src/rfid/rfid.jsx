import React, { Component } from "react";
import "../../materialize.css";
import "./rfid.css";
import Top from "./top/top.jsx";
import Mid from "./mid/mid.jsx";
import Control from "./control/control.jsx";
import { websocketClient } from "../websocket/websocketAdapter";

class Rfid extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.socket = websocketClient;
  }

  componentDidMount() {}

  render() {
    return (
      <div
        style={{ width: "100%", height: "100vh", backgroundColor: "#363636" }}
      >
        <Top socket={this.socket}></Top>
        <Mid socket={this.socket}></Mid>
        <Control socket={this.socket}></Control>
      </div>
    );
  }
}

export default Rfid;
