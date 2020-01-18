import React, { Component } from "react";
import M from "materialize-css";

class Mid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      informations: ""
    };

    this.socket = this.props.socket;
  }

  componentDidMount() {
    var instances = M.Modal.init(document.querySelectorAll(".modal"), {});
    this.socket.emit("getInformations");
    this.socket.on("gotInformations", informations => {
      console.log(informations.text);
      this.setState({ informations: informations.text });
    });
  }

  render() {
    return (
      <div
        style={{
          width: "100%",
          height: "25%",
          backgroundColor: "none",
          color: "white"
        }}
      >
        <div style={{ width: "90%", marginLeft: "auto", marginRight: "auto", paddingTop:"1%", fontSize: "1.9rem"}}>
          {this.state.informations}
        </div>
      </div>
    );
  }
}

export default Mid;
