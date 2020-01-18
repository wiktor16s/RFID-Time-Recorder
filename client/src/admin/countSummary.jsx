import React, { Component } from "react";
import { render } from "react-dom";
import moment from "moment";
import {
  websocketClient,
  websocketEventNames
} from "../websocket/websocketAdapter";
import M from "materialize-css";
import "./Admin.css";

class CountSummary extends Component {
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
      filteredEvents: [],
      pickedUser: "",
      total: ""
    };
    this.eachHours = [];

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
    this.filtre = this.filtre.bind(this);
    this.CalcTotal = this.CalcTotal.bind(this);
  }
  componentDidMount() {
    this.filtre();
    this.sideNav = M.Sidenav.init(document.getElementById("editSide"), {});
    websocketClient.on("updateData", () => {
      this.sideNav.close();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    this.eachHours = [];
    console.log("ilość ", this.props.events.length);
    if (prevProps.events != this.props.events) {
      this.filtre();
    }
    if (
      prevProps.month != this.props.month ||
      prevProps.year != this.props.year
    ) {
      this.filtre();
    }
  }
  componentWillUnmount() {}

  checkTotalHours(nodes) {
    //console.log(nodes);
  }

  filtre() {
    console.log("filtrowanie dla countSummary");
    let lookFor = this.props.events.filter((value, index) => {
      return (
        value.date === this.props.month + "." + this.props.year &&
        value.userID === this.props.user.userID
      );
    });

    if (lookFor.length > 0) {
      console.log("Wyfiltrowanych eventów: ", lookFor.length);
      this.setState({ filteredEvents: lookFor }, () => {
        this.adjustDates(this.state.filteredEvents);
      });
    } else {
      this.setState({ filteredEvents: [] }, () => {
        this.adjustDates(this.state.filteredEvents);
      });
    }
    return lookFor;
  }

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
    this.eachHours = [];
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
            break;

          case "outOfWork":
            outs.push(e.time);
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

        this.eachHours.push(finalTime);
        //
        Row.push(
          <td
            key={`time`}
            style={{
              display: "none",
              padding: 0,
              width: 0,
              minWidth: 0,
              maxWidth: 0,
              textAlign: "center",
              backgroundColor: "none",
              color: "none",
              cursor: "pointer",
              border: "none"
            }}
          ></td>
        );
        //
      } else if (ins.length > outs.length) {
        Row.push(
          <td
            key={`time`}
            style={{
              width: "100%",
              minWidth: "100%",
              maxWidth: "100%",
              textAlign: "center",
              backgroundColor: "rgb(255, 94, 91)",
              color: "white",
              cursor: "pointer"
            }}
          >
            Brak wyjścia dnia {prop.day}
          </td>
        );
      } else if (ins.length < outs.length) {
        Row.push(
          <td
            key={`time`}
            style={{
              width: "100%",
              minWidth: "100%",
              maxWidth: "100%",
              textAlign: "center",
              backgroundColor: "rgb(255, 94, 91)",
              color: "white",
              cursor: "pointer"
            }}
          >
            Brak wejścia dnia {prop.day}
          </td>
        );
      }
      return Row;
    } else {
      return (
        <td
          style={{
            display: "none",
            width: "90%",
            textAlign: "center",
            backgroundColor: "none"
          }}
        ></td>
      );
    }
  }

  DrawAllRows(props) {
    //console.log(props.data)
    let collection = [];
    for (let i = 1; i < 32; i++) {
      let j = i;
      if (j < 10) {
        j = "0" + j;
      }
      if (props.data[i] && props.data[i].length > 1) {
        collection.push(
          <table
            id={`eachRow-${i}`}
            style={{ padding: 0, margin: 0, width: "100%", border: "none" }}
          >
            <tbody>
              <tr
                key={i}
                style={{
                  backgroundColor: "none",
                  width: "100vh",
                  borderBottom: "none"
                }}
              >
                <this.ReturnOneRow rowData={props.data[i]} day={i} />
              </tr>
            </tbody>
          </table>
        );
      }
    }
    return collection;
  }

  DrawTable(prop) {
    //console.log("wszystkie ", this.eachHours);
    //console.log("redrawing ", prop.data);
    return (
      <div>
        <table id="mainTable" style={{ width: "100%" }}>
          <tbody>
            <this.DrawAllRows data={prop.data} date={prop.date} />
            <tr style={{ borderBottom: "none" }}>
              <td>
                <this.CalcTotal data={this.eachHours} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  CalcTotal(prop) {
    //console.log(prop);
    let final = {
      hours: 0,
      minutes: 0
    };

    prop.data.forEach(e => {
      if (e) {
        let _e = moment(e, "HH:mm").format();
        final.hours = final.hours + moment(_e).hours();
        final.minutes = final.minutes + moment(_e).minutes();
      }
    });
    // console.log(final);
    if (final.minutes % 60 !== 1) {
      let modulo = final.minutes % 60;
      let newHours = Math.floor(final.minutes / 60);
      final.hours = final.hours + newHours;
      final.minutes = modulo;
    }
    if (final.hours < 10) {
      final.hours = `0${final.hours}`;
    }
    if (final.minutes < 10) {
      final.minutes = `0${final.minutes}`;
    }
    return (
      <div>
        {final.hours}:{final.minutes}
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        <div id="startOfTableMark">
          <this.DrawTable data={this.state.eachDay} />
        </div>
      </React.Fragment>
    );
  }
}

export default CountSummary;
