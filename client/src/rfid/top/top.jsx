import React, { Component } from "react";
import moment from "moment";
import Clock from "react-live-clock";
import M from "materialize-css";

class Top extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: this.props.socket,
      isConnected: false
    };

    this.socket = this.props.socket;
    this.ConnectionStatus = this.ConnectionStatus.bind(this);
  }

  componentDidMount() {
    var instances = M.Modal.init(document.querySelectorAll(".modal"), {});

    setInterval(() => {
      console.log(this.socket.connected);
      if (this.socket.connected) {
        this.setState({ isConnected: true });
      } else {
        this.setState({ isConnected: false });
      }
    }, 2000);
  }

  ConnectionStatus(props) {
    if (props.isConnected) {
      return <div style={{color: "green"}}> &#11044; Połączony z serwerem </div>;
    } else {
      return <div style={{color: "red"}}> &#11044; Nie połączony z serwerem</div>;
    }
  }

  render() {
    return (
      <div
        style={{
          width: "100%",
          height: "15%",
          backgroundColor: "black",
          color: "white"
        }}
      >
        <div className="container">
          <div className="row">
            <div
              className=" col s6"
              style={{
                textAlign: "left",
                backgroundColor: "none"
              }}
            >
              <this.ConnectionStatus isConnected={this.state.isConnected} />
            </div>
            <div
              className="col s6"
              style={{
                backgroundColor: "none",
                alignItems: "center",
                justifyContent: "center",
                verticalAlign: "middle",
                textAlign: "right"
              }}
            >
              Sacewicz RFID
            </div>
          </div>
          <div className="row">
            <div
              className="col s12"
              style={{
                backgroundColor: "none",
                alignItems: "center",
                justifyContent: "center",
                verticalAlign: "middle",
                textAlign: "center"
              }}
            >
              <Clock
                style={{ fontSize: "2rem" }}
                format={"HH:mm:ss"}
                ticking={true}
              ></Clock>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Top;
