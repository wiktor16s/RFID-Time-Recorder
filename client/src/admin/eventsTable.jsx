// /644135282045
import React, { Component } from "react";
import { render } from "react-dom";
import moment from "moment";
import {
  websocketClient,
  websocketEventNames
} from "../websocket/websocketAdapter";
import M from "materialize-css";

class EventsTable extends Component {
  constructor(props) {
    super(props);
    //picked user
    //picked date
    //events
    this.state = {
      eachDay: [],
      sideNavData: {
        eventId: "",
        eventName: "",
        date: "",
        time: ""
      },
      pickedUser: ""
    };
    this.eachDay = [
      null,
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ];

    this.adjustDates = this.adjustDates.bind(this);
    this.DrawTable = this.DrawTable.bind(this);
    this.ReturnOneRow = this.ReturnOneRow.bind(this);
    this.DrawAllRows = this.DrawAllRows.bind(this);
  }
  componentDidMount() {
    this.sideNav = M.Sidenav.init(document.getElementById("editSide"), {});
    websocketClient.on("updateData", () => {
      this.sideNav.close();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.events != this.props.events) {
      this.adjustDates(this.props.events);
    }
  }
  componentWillUnmount() {}

  adjustDates(events) {
    this.eachDay = [
      null,
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ];
    events.forEach(e => {
      switch (e.day) {
        case "1":
        case "01":
          this.eachDay[1].push(e);
          break;
        case "2":
        case "02":
          this.eachDay[2].push(e);
          break;
        case "3":
        case "03":
          this.eachDay[3].push(e);
          break;
        case "4":
        case "04":
          this.eachDay[4].push(e);
          break;
        case "5":
        case "05":
          this.eachDay[5].push(e);
          break;
        case "6":
        case "06":
          this.eachDay[6].push(e);
          break;
        case "7":
        case "07":
          this.eachDay[7].push(e);
          break;
        case "8":
        case "08":
          this.eachDay[8].push(e);
          break;
        case "9":
        case "09":
          this.eachDay[9].push(e);
          break;

        case "10":
          this.eachDay[10].push(e);
          break;
        case "11":
          this.eachDay[11].push(e);
          break;
        case "12":
          this.eachDay[12].push(e);
          break;
        case "13":
          this.eachDay[13].push(e);
          break;
        case "14":
          this.eachDay[14].push(e);
          break;
        case "15":
          this.eachDay[15].push(e);
          break;
        case "16":
          this.eachDay[16].push(e);
          break;
        case "17":
          this.eachDay[17].push(e);
          break;
        case "18":
          this.eachDay[18].push(e);
          break;
        case "19":
          this.eachDay[19].push(e);
          break;
        case "20":
          this.eachDay[20].push(e);
          break;
        case "21":
          this.eachDay[21].push(e);
          break;
        case "22":
          this.eachDay[22].push(e);
          break;
        case "23":
          this.eachDay[23].push(e);
          break;
        case "24":
          this.eachDay[24].push(e);
          break;
        case "25":
          this.eachDay[25].push(e);
          break;
        case "26":
          this.eachDay[26].push(e);
          break;
        case "27":
          this.eachDay[27].push(e);
          break;
        case "28":
          this.eachDay[28].push(e);
          break;
        case "29":
          this.eachDay[29].push(e);
          break;
        case "30":
          this.eachDay[30].push(e);
          break;
        case "31":
          this.eachDay[31].push(e);
          break;
      }
    });
    this.setState({ eachDay: this.eachDay }, () => {
      //console.log(this.state.eachDay);
    });
  }

  ReturnOneRow(prop) {
    let rowData = prop.rowData;
    let Row = [];
    let ins = [];
    let outs = [];

    if (rowData && rowData.length > 0) {
      rowData = rowData
        .map(el => {
          el.fullDate = moment(
            `${el.day}.${el.date} ${el.time}`,
            "DD.MM.YYYY HH:mm:ss"
          ).format();
          return el;
        })
        .sort(function(a, b) {
          return new Date(a.fullDate) - new Date(b.fullDate);
        });

      let _width = 80 / rowData.length + "%";

      rowData.forEach((e, i) => {
        switch (e.closeupEvent) {
          case "startOfWork":
            ins.push(e.time);
            Row.push(
              <td
                key={i}
                style={{
                  width: _width,
                  minWidth: _width,
                  maxWidth: _width,
                  textAlign: "center",
                  backgroundColor: "#077187",
                  color: "white",
                  cursor: "pointer",
                  borderLeft: "1px solid black",
                  borderRight: "1px solid black"
                }}
                onClick={() => {
                  this.sideNav.open();
                  //console.log(e);
                  this.setState({
                    sideNavData: {
                      eventId: e.id,
                      eventName: e.closeupEvent,
                      date: `${e.day}.${e.date}`,
                      time: e.time
                    }
                  });
                }}
              >
                {e.time}
              </td>
            );
            break;

          case "outOfWork":
            outs.push(e.time);
            Row.push(
              <td
                key={i}
                style={{
                  width: _width,
                  minWidth: _width,
                  maxWidth: _width,
                  textAlign: "center",
                  backgroundColor: "#ff5e5b",
                  cursor: "pointer",
                  borderLeft: "1px solid black",
                  borderRight: "1px solid black"
                }}
                onClick={() => {
                  this.sideNav.open();
                  this.setState({
                    sideNavData: {
                      eventId: e.id,
                      eventName: e.closeupEvent,
                      date: `${e.day}.${e.date}`,
                      time: e.time
                    }
                  });
                  //console.log(e);
                }}
              >
                {e.time}
              </td>
            );
            break;
        }
      });
      //console.log(ins, outs);
      if (ins.length === outs.length) {
        let diffs = [];
        let finalTime = 0;

        for (let t = 0; t < ins.length; t++) {
          let startOfWork = moment(ins[t], "HH.mm.ss");
          let outOfWork = moment(outs[t], "HH.mm.ss");
          let duration = moment.duration(outOfWork.diff(startOfWork));
          let inHours = duration.asHours();
          diffs.push(inHours);
        }

        diffs.forEach(el => {
          finalTime = finalTime + el;
        });

        finalTime = moment()
          .startOf("day")
          .add(parseFloat(finalTime), "hours")
          .format("hh:mm");

        Row.push(
          <td
            key={`time`}
            style={{
              width: "10%",
              minWidth: "10%",
              maxWidth: "10%",
              textAlign: "center",
              backgroundColor: "#ffc857",
              color: "white",
              cursor: "pointer",
              borderLeft: "1px solid black",
              borderRight: "1px solid black"
            }}
          >
            {finalTime}
          </td>
        );
      } else if (ins.length > outs.length) {
        Row.push(
          <td
            key={`time`}
            style={{
              width: "10%",
              minWidth: "10%",
              maxWidth: "10%",
              textAlign: "center",
              backgroundColor: "#ffc857",
              color: "white",
              cursor: "pointer",
              borderLeft: "1px solid black",
              borderRight: "1px solid black"
            }}
          >
            Brak wyjścia
          </td>
        );
      } else if (ins.length < outs.length) {
        Row.push(
          <td
            key={`time`}
            style={{
              width: "10%",
              minWidth: "10%",
              maxWidth: "10%",
              textAlign: "center",
              backgroundColor: "#ffc857",
              color: "white",
              cursor: "pointer",
              borderLeft: "1px solid black",
              borderRight: "1px solid black"
            }}
          >
            Brak wejścia
          </td>
        );
      }
      return Row;
    } else {
      return (
        <td
          style={{ width: "90%", textAlign: "center", backgroundColor: "none" }}
        ></td>
      );
    }
  }

  DrawAllRows(props) {
    let collection = [];
    for (let i = 1; i < 32; i++) {
      let j = i;
      if (j < 10) {
        j = "0" + j;
      }
      collection.push(
        <table style={{ width: "100%", border: "1px solid black" }}>
          <tbody>
            <tr key={i} style={{ backgroundColor: "none", width: "100vh" }}>
              <td
                style={{
                  minWidth: "10%",
                  maxWidth: "10%",
                  width: "10%",
                  backgroundColor: "#00cecb"
                }}
              >
                {j}.{props.date}
              </td>
              <this.ReturnOneRow rowData={props.data[i]} day={i} />
            </tr>
          </tbody>
        </table>
      );
    }
    return collection;
  }

  DrawTable(prop) {
    //console.log("redrawing ", prop.data);
    return (
      <div>
        <table id="mainTable" style={{ width: "100%" }}>
          <tbody>
            <this.DrawAllRows data={prop.data} date={prop.date} />
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        <div id="startOfTableMark" className="no-print">
          <this.DrawTable
            data={this.state.eachDay}
            date={`${this.props.month}.${this.props.year}`}
          />
        </div>
        <React.Fragment>
          <ul id="editSide" className="sidenav" style={{ width: "70%" }}>
            <li style={{ color: "black" }}>
              <div className="user-view">
                <div className="row">
                  <button
                    onClick={() => {
                      websocketClient.emit(
                        "deleteEvent",
                        this.state.sideNavData.eventId
                      );
                    }}
                    className="btn red"
                  >
                    Usuń Zdarzenie
                  </button>
                </div>
                <div className="row">
                  <form className="col s12">
                    {this.state.pickedUser.name}
                    <div className="row">
                      <div className="col s8">
                        {this.state.sideNavData.eventId}
                      </div>
                      <div className="col s4"></div>

                      <br />
                      <span> {this.state.sideNavData.eventName}</span>
                    </div>
                    <div className="row">
                      <div className="input-field col s12">
                        <input
                          value={this.state.sideNavData.date}
                          id="date"
                          type="text"
                          className="datepicker"
                        />

                        <label htmlFor="date">Data</label>
                      </div>
                    </div>

                    <div className="row">
                      <div className="input-field col s12">
                        <input
                          value={this.state.sideNavData.time}
                          id="time"
                          type="text"
                          className="timepicker"
                        />
                        <label htmlFor="time">Czas</label>
                      </div>
                    </div>
                  </form>

                  <div className="container">
                    <div className="row">
                      <div className="col 6 left">
                        <button
                          className="btn"
                          onClick={() => {
                            let eventID = this.state.sideNavData.eventId;
                            let day = moment(
                              document.getElementById("date").value,
                              "DD"
                            ).format("DD");
                            let date = moment(
                              document.getElementById("date").value,
                              "DD"
                            ).format("MM.YYYY");
                            let time = document.getElementById("time").value;
                            //console.log(`day: ${day}## date: ${date}## time: ${time}`);
                            websocketClient.emit(
                              "updateEvent",
                              eventID,
                              day,
                              date,
                              time
                            );
                          }}
                        >
                          Potwierdź
                        </button>
                      </div>
                      <div className="col 6">
                        <button
                          className="btn blue"
                          onClick={() => {
                            let eventID = this.state.sideNavData.eventId;
                            let day = moment(
                              document.getElementById("date").value,
                              "DD"
                            ).format("DD");
                            let date = moment(
                              document.getElementById("date").value,
                              "DD"
                            ).format("MM.YYYY");
                            let time = this.props.setTimeTo;
                            //console.log(`day: ${day}## date: ${date}## time: ${time}`);
                            websocketClient.emit(
                              "updateEvent",
                              eventID,
                              day,
                              date,
                              time
                            );
                          }}
                        >
                          Przeciągnij do ustalonej godziny
                        </button>
                      </div>
                    </div>
                  </div>
                  <br />
                </div>
                <div className="row">
                  <div
                    className="col s12"
                    style={{
                      width: "100%",
                      height: "300px",
                      backgroundColor: "none"
                    }}
                  >
                    <button
                      className="btn"
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#f3de8a",
                        color: "black",
                        fontSize: "2rem"
                      }}
                      onClick={() => {
                        this.sideNav.close();
                      }}
                    >
                      Zamknij
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </React.Fragment>
      </React.Fragment>
    );
  }
}

export default EventsTable;
