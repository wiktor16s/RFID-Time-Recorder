import React, { Component } from "react";
import M from "materialize-css";
import ModalForCard from "../modal/ModalForCard.jsx";
import ModalForText from "../modal/ModalForText.jsx";
import ModalForEvents from "../modal/ModalForEvents.jsx";
import moment from "moment";

const styles = {
  app: {
    width: "100%",
    height: "60%",
    backgroundColor: "",
    color: "white"
  }
};

class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModalForCard: false,
      showModalForText: false,
      showModalForEvents: false,
      eventsForUser: [],
      eventsForUserForThisMonth: [],
      textForModal: "",
      todayDate: {
        day: moment(new Date()).format("DD"),
        month: moment(new Date()).format("MM"),
        year: moment(new Date()).format("YYYY")
      }
    };
    this.socket = this.props.socket;
    this.sendEvent = this.sendEvent.bind(this);
  }

  componentDidMount() {
    let instances = M.Modal.init(document.querySelectorAll(".modal"), {});
    this.socket.on("eventDone", text => {
      this.setState(
        {
          textForModal: text
        },
        () => {
          console.log("new", this.state.textForModal);
          this.setState({ showModalForCard: false, showModalForText: true });
        }
      );
    });

    this.socket.on("gotEventsByUserID", events => {
      console.log("events: ", events);
      this.setState(
        {
          showModalForCard: false,
          showModalForText: false,
          showModalForEvents: true,
          eventsForUser: events
        },
        () => {
          let temp = this.state.eventsForUser.filter(x => {
            console.log("map: ", x);
            return (
              x.date ==
              `${this.state.todayDate.month}.${this.state.todayDate.year}`
            );
          });
          this.setState({ eventsForUserForThisMonth: temp });
        }
      );
    });
  }

  sendEvent(event) {
    this.setState({
      showModalForCard: true,
      showModalForText: false,
      showModalForEvents: false
    });
    console.log("data-from-android " + event);
    this.socket.emit("data-from-android", { data: event });
  }

  render() {
    return (
      <div style={styles.app}>
        <ModalForCard
          socket={this.socket}
          isShow={this.state.showModalForCard}
        />
        <ModalForText
          socket={this.socket}
          isShow={this.state.showModalForText}
          title="Informacja"
          text={this.state.textForModal}
        />

        <ModalForEvents
          socket={this.socket}
          isShow={this.state.showModalForEvents}
          title="Wykaz godzin w tym miesiącu"
          events={this.state.eventsForUserForThisMonth}
          month={this.state.todayDate.month}
          year={this.state.todayDate.year}
        />

        <div
          className="container-fluid"
          style={{ height: "100%", paddingTop: "5%", fontSize: "2rem" }}
        >
          <div
            className="row"
            style={{ height: "60%", backgroundColor: "none" }}
          >
            <div
              className="col s6"
              style={{
                height: "100%",
                backgroundColor: "none",
                marginLeft: " auto",
                marginRight: "auto",
                textAlign: "center"
              }}
            >
              <button
                className="btn"
                style={{
                  height: "100%",
                  width: "95%",
                  backgroundColor: "#3c91e6",
                  fontSize: "2rem",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
                onClick={() => {
                  this.sendEvent("IN");
                }}
              >
                Wejście
              </button>
            </div>

            <div
              className="col s6"
              style={{
                height: "100%",
                backgroundColor: "none",
                marginLeft: " auto",
                marginRight: "auto",
                textAlign: "center"
              }}
            >
              <button
                className="btn"
                style={{
                  height: "100%",
                  width: "95%",
                  backgroundColor: "#ff220c",
                  fontSize: "2rem",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
                onClick={() => {
                  this.sendEvent("OUT");
                }}
              >
                Wyjście
              </button>
            </div>
          </div>
          <div
            className="row"
            style={{ height: "30%" }}
          >
            <div
              className="col s9"
              style={{
                height: "100%",
                backgroundColor: "none",
                marginLeft: " auto",
                marginRight: "auto",
                textAlign: "center"
              }}
            >
              <button
                className="btn"
                style={{
                  height: "100%",
                  width: "97%",
                  backgroundColor: "#f6f930",
                  color: "#363636",
                  fontSize: "2rem"
                }}
                onClick={() => {
                  this.sendEvent("INFO");
                }}
              >
                Informacje
              </button>
            </div>
            <div
              className="col s3"
              style={{
                height: "100%",
                backgroundColor: "none",
                marginLeft: " auto",
                marginRight: "auto",
                textAlign: "center"
              }}
            >
              <button
                className="btn"
                style={{
                  height: "100%",
                  width: "95%",
                  backgroundColor: "#f6f7eb",
                  color: "#363636",
                  fontSize: "2rem",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
                onClick={() => {
                  this.sendEvent("EVENTS");
                }}
              >
                Godziny
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Control;
