// /644135282045
import React, { Component } from "react";
import { render } from "react-dom";
import moment from "moment";

class EventsTable extends Component {
  constructor(props) {
    super(props);
    //picked user
    //picked date
    //events
    this.state = {
      eachDay: []
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
    this.adjustDates(this.props.events);
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
          console.log("each difs: ", el);
        });
        console.log("final Date ", finalTime);
        let total = {
          hours: 0,
          minutes: 0,
          seconds: 0
        };

        let decimalTime = parseFloat(finalTime);
        decimalTime = decimalTime * 60 * 60;
        total.hours = Math.floor(decimalTime / (60 * 60));
        decimalTime = decimalTime - total.hours * 60 * 60;
        total.minutes = Math.floor(decimalTime / 60);
        decimalTime = decimalTime - total.minutes * 60;
        total.seconds = Math.round(decimalTime);
        if (total.hours < 10) {
          total.hours = "0" + total.hours;
        }
        if (total.minutes < 10) {
          total.minutes = "0" + total.minutes;
        }
        if (total.seconds < 10) {
          total.seconds = "0" + total.seconds;
        }

        console.log(total);

        finalTime = `${total.hours}:${total.minutes}:${total.seconds}`

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
                  backgroundColor: "white",
                  color: "black"
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
    console.log("redrawing ", this.props);
    return (
      <React.Fragment>
        <div id="startOfTableMark" className="no-print">
          <this.DrawTable
            data={this.state.eachDay}
            date={`${this.props.month}.${this.props.year}`}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default EventsTable;
