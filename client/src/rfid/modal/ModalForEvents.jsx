import React, { Component } from "react";
import M from "materialize-css";
import EventsTable from "../control/eventsTable.jsx";

class ModalForEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      text: this.props.text
    };

    this.socket = this.props.socket;

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    this.instance = M.Modal.init(document.getElementById("ModalForEvents"), {});
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

  componentWillUnmount() {}

  closeModal(event) {
    this.instance.close();
    if (event) {
      console.log("data-from-android ", event);
      this.socket.emit("data-from-android", { data: event });
    }
  }

  render() {
    return (
      <div>
        <div
          id="ModalForEvents"
          className="modal fullSize"
          style={{ position: "fixed", top: "-20px", left: 0 }}
        >
          <div
            className="modal-content"
            style={{
              height: "100%",
              width: "100%",
              backgroundColor: "black",
              color: "white",
              textAlign: "center",
              overflow: "auto"
            }}
          >
            <EventsTable
              month={this.props.month}
              year={this.props.year}
              events={this.props.events}
            />
          </div>
          <button
            className="btn"
            onClick={() => {
              this.closeModal("Cancel");
            }}
            style={{
              width: "50px",
              height: "50px",
              position: "fixed",
              top: "10px",
              right: "10px",
              background: "white",
              color: "black"
            }}
          >
            X
          </button>
        </div>
      </div>
    );
  }
}

export default ModalForEvents;
