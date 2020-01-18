import React, { Component } from "react";
import M from "materialize-css";

class ModalForCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.socket = this.props.socket;

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    this.instance = M.Modal.init(document.getElementById("ModalForCard"), {});
  }

  componentDidUpdate() {
    if (this.props.isShow === true) {
      this.openModal();
    } else {
      this.closeModal();
    }
  }

  openModal() {
    this.instance.open();
  }

  closeModal(event) {
    this.instance.close();
    if (event) {
      console.log("data-from-android", event);
      this.socket.emit("data-from-android", { data: event });
    }
  }

  render() {
    return (
      <div>
        <div
          id="ModalForCard"
          className="modal"
          style={{ height: "100vh", maxHeight: "100vh" }}
        >
          <div
            className="modal-content"
            style={{
              height: "40vh",
              backgroundColor: "black",
              color: "white",
              textAlign: "center"
            }}
          >
            <h4>Zbliż kartę do czytnika</h4>
          </div>
          <div
            className="modal-footer"
            style={{
              backgroundColor: "black",
              color: "white",
              textAlign: "center",
              height: "15vh",
              maxHeight: "15vh"
            }}
          >
            <button
              className="btn"
              onClick={() => {
                this.closeModal("Cancel");
              }}
              style={{
                width: "90%",
                height: "90%",
                backgroundColor: "#e8c547"
              }}
            >
              Zamknij
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ModalForCard;
