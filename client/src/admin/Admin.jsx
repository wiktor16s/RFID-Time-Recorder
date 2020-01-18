import React, { Component } from "react";
import "./Admin.css";
import AdminHeader from "./adminHeader/AdminHeader";
import {
  websocketClient,
  websocketEventNames
} from "../websocket/websocketAdapter";
import Table from "../components/Table/index.jsx";
import TableFilter from "../components/TableFilter";
import M from "materialize-css";
import moment from "moment";
import _ from "lodash";
import EventsTable from "./eventsTable";
import CountSummary from "./countSummary";

class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      closeupEvents: [],
      filteredDates: [],
      pickedDate: "",
      tableFilter: {
        date: "",
        event: "",
        worker: "",
        showAllMonth: true
      },
      pickedUser: {
        name: "",
        id: ""
      },
      sideNavData: {
        name: "",
        id: "",
        eventId: "",
        eventName: "",
        date: "",
        time: ""
      },
      showAllMonth: true,
      allMonthData: false,
      dataSets: [],
      actualDataSet: [
        {
          title: "data",
          data: []
        }
      ],
      informations: "",
      dataFilteredForTable: [],
      actualMonth: new Date().getMonth() + 1,
      actualYear: new Date().getFullYear(),
      setTimeTo: ""
    };

    this.ctx = null;
    this.timePickerOptions = {
      twelveHour: false
    };
    this.dataPickerOptions = {
      defaultDate: moment().format(),
      setDefaultDate: true,
      format: "dd.mm.yyyy",
      i18n: {
        months: [
          "Styczeń",
          "Luty",
          "Marzec",
          "Kwiecień",
          "Maj",
          "Czerwiec",
          "Lipiec",
          "Sierpień",
          "Wrzesień",
          "Październik",
          "Listopad",
          "Grudzień"
        ],
        monthsShort: [
          "Sty",
          "Lut",
          "Mar",
          "Kwi",
          "Maj",
          "Czer",
          "Lip",
          "Sie",
          "Wrz",
          "Paź",
          "Lis",
          "Gru"
        ],
        weekdays: [
          "Niedziela",
          "Poniedziałek",
          "Wtorek",
          "Środa",
          "Czwartek",
          "Piątek",
          "Sobota"
        ],
        weekdaysShort: ["Nie", "Pon", "Wto", "Śro", "Czw", "Pią", "Sob"],
        weekdaysAbbrev: ["N", "P", "W", "Ś", "C", "P", "S"]
      },
      onSelect: date => {
        this.setState({ pickedDate: date });
        this.setState({
          tableFilter: {
            date: date,
            event: "all",
            worker: this.state.pickedUser,
            showAllMonth: this.state.showAllMonth
          }
        });
      }
    };

    this.childHandler = this.childHandler.bind(this);
    this.childFilterHandler = this.childFilterHandler.bind(this);
    this.filtre = this.filtre.bind(this);
    this.setTableFilterValue = this.setTableFilterValue.bind(this);
    this.setNavbarData = this.setNavbarData.bind(this);
    this.DisplayUsersInOptions = this.DisplayUsersInOptions.bind(this);
    this.MonthPicker = this.MonthPicker.bind(this);
    this.getAllInfo = this.getAllInfo.bind(this);

    this.dataSet = [];
    this.listOfCharts = [];
    this.dataPicker = {};
  }

  componentDidMount() {
    this.getAllInfo();

    websocketClient.on(websocketEventNames.GOT_USERS, users => {
      this.setState({ users });
      console.log(this.state.users);
    });

    websocketClient.on(
      websocketEventNames.GOT_CLOSEUP_EVENTS,
      closeupEvents => {
        this.setState({ closeupEvents }, () => {
          this.filtre({
            worker: this.state.pickedUser
          });
        });
        //console.log("all events: ", this.state.closeupEvents);
      }
    );

    websocketClient.on("gotInformations", informations => {
      //console.log("informacje: ", informations.text);
      if (informations) {
        this.setState({ informations: informations.text });
      }
    });

    websocketClient.on("gotSetTime", time => {
      console.log(time.setTime);
      this.setState({ setTimeTo: time.setTime });
    });

    websocketClient.on("updateData", () => {
      alert("OK");
      this.getAllInfo();
    });

    this.dataPicker = M.Datepicker.init(
      document.querySelectorAll(".datepicker"),
      this.dataPickerOptions
    );

    let timePicker = M.Timepicker.init(
      document.querySelectorAll(".timepicker"),
      this.timePickerOptions
    );

    M.FormSelect.init(document.querySelectorAll("select"), {});
    M.Sidenav.init(document.querySelectorAll(".sidenav"), {});
    M.Collapsible.init(document.querySelectorAll(".collapsible"), {});
  }

  componentWillUnmount() {
    websocketClient.off(websocketEventNames.GOT_USERS);
    websocketClient.off(websocketEventNames.GOT_CLOSEUP_EVENTS);
  }

  componentDidUpdate() {
    //console.log(this.state.dataSets);
  }

  getAllInfo() {
    websocketClient.emit("getInformations");
    websocketClient.emit("getSetTime");
    websocketClient.emit(websocketEventNames.GET_ALL_USERS);
    websocketClient.emit(websocketEventNames.GET_ALL_CLOSEUP_EVENTS);
  }

  childHandler(dataFromChild) {
    //console.log("set user: ", dataFromChild);
    this.setState(
      {
        pickedUser: { name: dataFromChild.name, id: dataFromChild.id }
      },
      () => {
        this.changeColorOfRow(dataFromChild.key);
        this.filtre({
          worker: this.state.pickedUser
        });
      }
    );
  }
  changeColorOfRow(key) {
    for (
      let i = 0;
      i < document.getElementsByClassName("table-main")[0].childElementCount;
      i++
    ) {
      document.getElementsByClassName("table-main")[0].childNodes[
        i
      ].style.backgroundColor = "white";
    }
    document.getElementsByClassName("table-main")[0].childNodes[
      key
    ].style.backgroundColor = "#64b5f6";
  }

  childFilterHandler(dataFromChild) {}

  filtre(data) {
    let lookFor = this.state.closeupEvents.filter((value, index) => {
      return (
        value.date === this.state.actualMonth + "." + this.state.actualYear &&
        value.userID === data.worker.id
      );
    });

    //console.log("Wyfitrowana tablica: ", lookFor);
    if (lookFor.length > 0) {
      console.log("Wyfiltrowanych eventów: ", lookFor.length);
      this.setState({ dataFilteredForTable: lookFor });
    } else {
      console.log("brak danych");
      this.setState({ dataFilteredForTable: [] });
    }
    return lookFor;
  }

  setTableFilterValue(value) {
    this.setState(
      {
        tableFilter: {
          date: this.state.pickedDate,
          event: value,
          worker: this.state.pickedUser,
          showAllMonth: this.state.showAllMonth
        }
      },
      () => {
        //console.log("USER: ", this.state.pickedUser);
      }
    );
  }
  setNavbarData(data) {
    //console.log(data);
    this.setState({
      sideNavData: {
        name: data.id,
        id: data.id,
        eventId: data.id,
        eventName: data.closeupEvent,
        date: `${data.day}.${data.date}`,
        time: data.time
      }
    });
  }

  DisplayUsersInOptions(props) {
    let final = [];
    props.users.forEach((element, i) => {
      final.push(
        <option key={i} value={element.userID}>
          {element.userName}
        </option>
      );
    });
    //console.log(final);
    return final;
  }

  MonthPicker(props) {
    let clearColors = e => {
      console.log(e.target.id);
      let collection = document.getElementsByClassName("month");

      for (let i = 0; i < collection.length; i++) {
        collection[i].style.backgroundColor = "transparent";
      }
      e.target.style.backgroundColor = "#00CECB";
      this.setState({ actualMonth: e.target.id }, () => {
        this.filtre({
          worker: this.state.pickedUser
        });
      });
    };
    return (
      <div className="container no-print" style={{ textAlign: "center" }}>
        <div className="row">
          <div className="col s4"></div>
          <div className="col s4">
            <div className="input-field col s12">
              <select
                onChange={e => {
                  console.log(e.target.value);
                  this.setState({ actualYear: e.target.value }, () => {
                    this.filtre({
                      worker: this.state.pickedUser
                    });
                  });
                }}
              >
                <option value="2019">2019</option>
                <option value="2020">2020</option>
                <option value="2021">2021</option>
              </select>
              <label>Zmień rok</label>
            </div>
          </div>
          <div className="col s4">
            <a href="#startOfTableMark">Zjedź na dół</a>
          </div>
        </div>
        <br />
        <div className="row">
          <div
            id="01"
            className="col s3 month"
            style={{ cursor: "pointer" }}
            onClick={e => {
              clearColors(e);
            }}
          >
            Styczeń
          </div>
          <div
            id="02"
            className="col s3 month"
            style={{ cursor: "pointer" }}
            onClick={e => {
              clearColors(e);
            }}
          >
            Luty
          </div>
          <div
            id="03"
            className="col s3 month"
            style={{ cursor: "pointer" }}
            onClick={e => {
              clearColors(e);
            }}
          >
            Marzec
          </div>
          <div
            id="04"
            className="col s3 month"
            style={{ cursor: "pointer" }}
            onClick={e => {
              clearColors(e);
            }}
          >
            Kwiecień
          </div>
        </div>
        <div className="row">
          <div
            id="05"
            className="col s3 month"
            style={{ cursor: "pointer" }}
            onClick={e => {
              clearColors(e);
            }}
          >
            Maj
          </div>
          <div
            id="06"
            className="col s3 month"
            style={{ cursor: "pointer" }}
            onClick={e => {
              clearColors(e);
            }}
          >
            Czerwiec
          </div>
          <div
            id="07"
            className="col s3 month"
            style={{ cursor: "pointer" }}
            onClick={e => {
              clearColors(e);
            }}
          >
            Lipiec
          </div>
          <div
            id="08"
            className="col s3 month"
            style={{ cursor: "pointer" }}
            onClick={e => {
              clearColors(e);
            }}
          >
            Sierpień
          </div>
        </div>
        <div className="row">
          <div
            id="09"
            className="col s3 month"
            style={{ cursor: "pointer" }}
            onClick={e => {
              clearColors(e);
            }}
          >
            Wrzesień
          </div>
          <div
            id="10"
            className="col s3 month"
            style={{ cursor: "pointer" }}
            onClick={e => {
              clearColors(e);
            }}
          >
            Październik
          </div>
          <div
            id="11"
            className="col s3 month"
            style={{ cursor: "pointer" }}
            onClick={e => {
              clearColors(e);
            }}
          >
            Listopad
          </div>
          <div
            id="12"
            className="col s3 month"
            style={{ cursor: "pointer" }}
            onClick={e => {
              clearColors(e);
            }}
          >
            Grudzień
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <AdminHeader></AdminHeader>
        <br className="no-print" />
        <br className="no-print" />
        <this.MonthPicker
          month={this.state.actualMonth}
          year={this.state.actualYear}
        />

        <br className="no-print" />

        <ul className="collapsible no-print">
          <li>
            <div className="collapsible-header">Dodaj Zdarzenie</div>
            <div className="collapsible-body row">
              <div className="input-field col s3">
                <select id="addEvent-user" className="browser-default">
                  <option value="" disabled selected></option>
                  <this.DisplayUsersInOptions users={this.state.users} />
                </select>
              </div>

              <div className="input-field col s2 no-print">
                <select id="addEvent-event">
                  <option value="" disabled selected></option>
                  <option value="startOfWork">Wejście</option>
                  <option value="outOfWork">Wyjście</option>
                </select>
                <label>Zdarzenie</label>
              </div>

              <div className="input-field col s3">
                <input type="text" id="addEvent-date" className="datepicker" />
                <label>Data</label>
              </div>

              <div className="input-field col s3">
                <input type="text" id="addEvent-time" className="timepicker" />
                <label>Godzina</label>
              </div>
              <div className="input-field col s1">
                <button
                  className="btn"
                  onClick={() => {
                    let addEventData = {
                      user: document.getElementById("addEvent-user").value,
                      event: document.getElementById("addEvent-event").value,
                      date: moment(
                        document.getElementById("addEvent-date").value,
                        "DD.MM.YYYY"
                      ).format("MM.YYYY"),
                      day: moment(
                        document.getElementById("addEvent-date").value,
                        "DD.MM.YYYY"
                      ).format("DD"),
                      time: document.getElementById("addEvent-time").value
                    };
                    //console.log(addEventData);
                    websocketClient.emit(
                      "addEvent",
                      addEventData.user,
                      addEventData.event,
                      addEventData.day,
                      addEventData.date,
                      addEventData.time
                    );
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </li>
        </ul>

        <ul className="collapsible no-print">
          <li>
            <div className="collapsible-header ">Zmień informacje</div>
            <div className="collapsible-body row">
              <div className="input-field col s12">
                <div className="row">
                  <form className="col s12">
                    <div className="row">
                      <div className="input-field col s12">
                        <textarea
                          value={this.state.informations}
                          id="textarea1"
                          className="materialize-textarea"
                          onChange={e => {
                            this.setState({ informations: e.target.value });
                          }}
                        ></textarea>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <button
                className="btn"
                onClick={() => {
                  websocketClient.emit(
                    "changeInformations",
                    this.state.informations
                  );
                }}
              >
                OK
              </button>
            </div>
          </li>
        </ul>

        <ul className="collapsible no-print">
          <li>
            <div className="collapsible-header ">Przeciąganie godzin</div>
            <div className="collapsible-body row">
              <div className="input-field col s12">
                <div className="row">
                  <form className="col s4">
                    <div className="row">
                      <div className="input-field col s12">
                        <input
                          value={this.state.setTimeTo}
                          id="textarea2"
                          onChange={e => {
                            this.setState({ setTimeTo: e.target.value });
                          }}
                        ></input>
                        <span>HH:MM:SS</span>
                        <br />
                        <span> Pamiętaj że 01 to co innego niż 1</span>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <button
                className="btn"
                onClick={() => {
                  websocketClient.emit("changeSetTime", this.state.setTimeTo);
                }}
              >
                OK
              </button>
            </div>
          </li>
        </ul>

        <ul className="collapsible no-print">
          <li>
            <div className="collapsible-header">Dodaj użytkownika</div>
            <div className="collapsible-body row">
              <div className="input-field col s6">
                <input
                  placeholder="Wpisz imie i nazwisko"
                  id="first_name"
                  type="text"
                  className="validate"
                />
                <label htmlFor="first_name">Imie i nazwisko</label>
              </div>

              <div className="input-field col s6">
                <input
                  placeholder="Wpisz numer karty"
                  id="card_name"
                  type="text"
                  className="validate"
                />
                <label htmlFor="card_name">Numer karty</label>
              </div>

              <button
                className="btn"
                onClick={() => {
                  websocketClient.emit(
                    "addUser",
                    document.getElementById("first_name").value,
                    document.getElementById("card_name").value
                  );
                }}
              >
                OK
              </button>
            </div>
          </li>
        </ul>

        <ul className="collapsible no-print">
          <li>
            <div className="collapsible-header">Usuń użytkownika</div>
            <div className="collapsible-body row">
              <div className="input-field col s3">
                <select id="delete-user" className="browser-default">
                  <option value="" disabled selected></option>
                  <this.DisplayUsersInOptions users={this.state.users} />
                </select>
              </div>
              <button
                className="btn"
                onClick={() => {
                  websocketClient.emit(
                    "deleteUser",
                    document.getElementById("delete-user").value
                  );
                }}
              >
                OK
              </button>
            </div>
          </li>
        </ul>

        <br />
        <div className="App__body">
          <Table
            action={this.childHandler}
            columns={[
              {
                header: "Imie",
                cell: user => (
                  <React.Fragment>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <label
                        className="no-print"
                        onClick={e => {
                          e.stopPropagation();
                        }}
                      >
                        <input
                          type="checkbox"
                          defaultChecked={true}
                          onClick={e => {
                            switch (e.target.checked) {
                              case true:
                                e.target.parentNode.parentNode.parentNode.parentNode.classList.remove(
                                  "no-print"
                                );
                                break;
                              case false:
                                e.target.parentNode.parentNode.parentNode.parentNode.classList.add(
                                  "no-print"
                                );
                                break;
                            }
                          }}
                        />
                        <span></span>
                      </label>
                      <div>{user.userName}</div>
                    </div>
                  </React.Fragment>
                )
              },
              {
                header: "Karta",
                cell: user => <React.Fragment>{user.userID}</React.Fragment>
              },
              {
                header: "Status",
                cell: user => <React.Fragment>{user.userStatus}</React.Fragment>
              },
              {
                header: "Suma",
                cell: user => (
                  <React.Fragment>
                    <CountSummary
                      events={this.state.closeupEvents}
                      month={this.state.actualMonth}
                      year={this.state.actualYear}
                      user={user}
                    />
                  </React.Fragment>
                )
              }
            ]}
            data={this.state.users}
          />

          <EventsTable
            events={this.state.dataFilteredForTable}
            month={this.state.actualMonth}
            year={this.state.actualYear}
            setTimeTo={this.state.setTimeTo}
          />

          <button
            value={"startOfWork"}
            className="btn no-print"
            type="button"
            onClick={e => {
              this.setTableFilterValue(e.target.value);
            }}
          >
            Wejścia
          </button>
          <button
            value={"outOfWork"}
            className="btn no-print"
            type="button"
            onClick={e => {
              this.setTableFilterValue(e.target.value);
            }}
          >
            Wyjścia
          </button>
          <button
            value={"all"}
            className="btn no-print"
            type="button"
            onClick={e => {
              this.setTableFilterValue(e.target.value);
            }}
          >
            Wszystko
          </button>

          <TableFilter
            action={this.childFilterHandler}
            filter={this.state.tableFilter}
            worker={this.state.pickedUser}
            className="no-print"
            showAllMonth={true}
            columns={[
              {
                header: "date",
                cell: closeupEvent => (
                  <React.Fragment>
                    {closeupEvent.day + "." + closeupEvent.date}
                  </React.Fragment>
                )
              },
              {
                header: "time",
                cell: closeupEvent => (
                  <React.Fragment>{closeupEvent.time}</React.Fragment>
                )
              },
              {
                header: "event",
                cell: closeupEvent => (
                  <React.Fragment>{closeupEvent.closeupEvent}</React.Fragment>
                )
              },
              {
                header: "user ID",
                cell: closeupEvent => (
                  <React.Fragment>{this.state.pickedUser.name}</React.Fragment>
                )
              },
              {
                header: "event ID",
                cell: closeupEvent => {
                  //console.log(closeupEvent);
                  return (
                    <button
                      href="#"
                      data-target="slide-out"
                      className="sidenav-trigger btn"
                      onClick={() => {
                        this.setNavbarData(closeupEvent);
                      }}
                    >
                      <i className="material-icons">{closeupEvent.id}</i>
                    </button>
                  );
                }
              }
            ]}
            data={this.state.closeupEvents}
          />
        </div>

        <React.Fragment>
          <ul id="slide-out" className="sidenav" style={{ width: "70%" }}>
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
                  <br />
                </div>
              </div>
            </li>
          </ul>
        </React.Fragment>
      </div>
    );
  }
}

export default Admin;
