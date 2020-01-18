import "core-js/stable";
import "regenerator-runtime/runtime";
import errorHandler from "./server/ErrorHandler";

import configs from "./server/config.json";
import Queries from "./server/Queries";
import tools from "./server/Tools";
import Sql from "./server/Sql";
import path from "path";
import moment from "moment";
import staticFiles from "node-static";
import http from "http";

import getSocketInstance from "./server/webSocket/getSocketInstance";
import { getID, killChild } from "./rfidApi/rfidApi";

const sql = new Sql(configs.db);
const queries = new Queries(sql);
const port = configs.serverPort;
const file = new staticFiles.Server(path.join(__dirname, "client"));

const server = http
  .createServer(function(request, response) {
    request
      .addListener("end", function() {
        file.serve(request, response);
      })
      .resume();
  })
  .listen(port, () => {
    console.log("server listening on port " + port);


    const wallRfidIO = getSocketInstance(server, "/android");
    const adminIo = getSocketInstance(server, "/admin");
    const remoteIO = getSocketInstance(server, "/remoteUser");

    process.stdin.resume();
    tools.cleanup();
    errorHandler.init();

    remoteIO.on("connection", remoteSocket => {
      console.log("remote user connected", remoteSocket.id);
      remoteSocket.on("event", (event, photo, id, adnotation, date) => {
        switch (event) {
          case "startOfWork":
            console.log("startOfWork");
            _temp = photo;
            _event = event;
            _id = id;
            _adnotation = adnotation;
            _date = date;
            queries.addEventFromPhone(
              id,
              event,
              date.day,
              date.date,
              date.time,
              adnotation,
              photo
            );
            break;

          case "outOfWork":
            console.log("outOfWork");
            _temp = photo;
            _event = event;
            _id = id;
            queries.addEventFromPhone(
              id,
              event,
              date.day,
              date.date,
              date.time,
              adnotation,
              photo
            );
            break;
        }
      });

      remoteSocket.on("logMe", (username, password) => {
        queries.tryToLogIn(username, password).then(e => {
          remoteSocket.emit("logRes", e);
        });
      });
    });

    adminIo.on("connection", function(AdminSocket) {
      console.log("Admin Socket Connected");

      AdminSocket.on("getAllUsers", () => {
        queries.getAllUsers().then(users => {
          AdminSocket.emit("gotUsers", users);
        });
      });

      AdminSocket.on("getAllEvents", () => {
        queries.getAllEvents().then(events => {
          AdminSocket.emit("gotEvents", events);
        });
      });

      AdminSocket.on("getEventsByName", user => {
        queries.getEventsByName(user).then(events => {
          AdminSocket.emit("gotEventsByName", events);
        });
      });
      AdminSocket.on("getUsersByUserID", id => {
        queries.getUsersByUserID(id).then(user => {
          AdminSocket.emit("gotUsersByUserID", user);
        });
      });
      AdminSocket.on("getEventsByUserID", id => {
        queries.getEventsByUserId(id).then(events => {
          AdminSocket.emit("gotEventsByUserID", events);
        });
      });

      AdminSocket.on("addUser", (name, id) => {
        queries.addUser(name, id).then(state => {
          if (state) {
            AdminSocket.emit("updateData");
          } else {
            console.error(state);
          }
        });
      });

      AdminSocket.on("deleteUser", id => {
        queries.deleteUser(id).then(state => {
          if (state) {
            AdminSocket.emit("updateData");
          } else {
            console.error(state);
          }
        });
      });

      AdminSocket.on("addEvent", (id, status, day, date, time) => {
        queries.addEvent(id, status, day, date, time).then(state => {
          if (state) {
            AdminSocket.emit("updateData");
          } else {
            console.error(state);
          }
        });
      });

      AdminSocket.on("deleteEvent", id => {
        queries.deleteEvent(id).then(state => {
          if (state) {
            AdminSocket.emit("updateData");
          } else {
            console.error(state);
          }
        });
      });

      AdminSocket.on("changeInformations", text => {
        queries.changeInfo(text).then(state => {
          if (state) {
            AdminSocket.emit("updateData");
          } else {
            console.error(state);
          }
        });
      });

      AdminSocket.on("getInformations", () => {
        queries.getInformations(AdminSocket).then(informations => {
          AdminSocket.emit("gotInformations", informations);
        });
      });

      AdminSocket.on("getSetTime", () => {
        queries.getSetTime().then(setTime => {
          AdminSocket.emit("gotSetTime", setTime);
        });
      });

      AdminSocket.on("changeSetTime", newTime => {
        queries.changeSetTime(newTime).then(() => {
          AdminSocket.emit("updateData");
        });
      });

      AdminSocket.on("updateEvent", (eventID, day, date, time) => {
        queries.updateEvent(eventID, day, date, time).then(state => {
          if (state) {
            AdminSocket.emit("updateData");
          } else {
            console.error(state);
          }
        });
      });

      AdminSocket.on("checkStatus", id => {
        queries.checkStatus(id).then(status => {
          adminSocket.emit("checkStatus-response", status);
        });
      });

      AdminSocket.on("getPhotoByEventId", id => {
        console.log("getting photo");
        queries.getPhotoByEventId(id).then(e => {
          console.log("got photo, sending...");
          AdminSocket.emit("gotPhotoByEventId", e);
        });
      });

      AdminSocket.on("checkToken", actualToken => {
        queries.getToken().then(response => {
          if (response.token === actualToken) {
            AdminSocket.emit("checkedToken", true);
          } else {
            AdminSocket.emit("checkedToken", false);
          }
        });
      });

      AdminSocket.on("disconnect", () => {
        console.log("Admin Socket Disconnected");
        AdminSocket = null;
      });
    });

    wallRfidIO.on("connection", function(WallRfidSocket) {
      console.log("Android Socket Connected");

      WallRfidSocket.on("getInformations", text => {
        queries.getInformations().then(informations => {
          WallRfidSocket.emit("gotInformations", informations);
        });
      });

      WallRfidSocket.on("getEventsByUserID", id => {
        queries.getEventsByUserId(id).then(events => {
          WallRfidSocket.emit("gotEventsByUserID", events);
        });
      });

      WallRfidSocket.on("addEvent", (id, status, day, date, time) => {
        queries.addEvent(id, status, day, date, time).then(state => {
          if (state) {
            WallRfidSocket.emit("updateData");
          } else {
            console.error(state);
          }
        });
      });

      WallRfidSocket.on("data-from-android", message => {
        switch (message.data) {
          case "IN":
            console.log("case in");
            getID("IN")
              .then(data => {
                let id = data.replace(/(\r\n|\n|\r)/gm, "");

                queries
                  .addEvent(
                    id,
                    "startOfWork",
                    moment().format("DD"),
                    moment().format("MM.YYYY"),
                    moment().format("HH:mm:ss")
                  )
                  .then(state => {
                    if (state) {
                      WallRfidSocket.emit("updateData");
                    } else {
                      console.error(state);
                    }
                  });

                queries.getUsersByUserIDAndroid(id).then(user => {
                  console.log(user);
                  WallRfidSocket.emit(
                    "eventDone",
                    `Dzień dobry ${user[0].userName}`
                  );
                });
              })
              .catch(err => {
                console.error(err);
              });
            break;

          case "OUT":
            console.log("case out");

            getID("OUT")
              .then(data => {
                let id = data.replace(/(\r\n|\n|\r)/gm, "");
                queries
                  .addEvent(
                    id,
                    "outOfWork",
                    moment().format("DD"),
                    moment().format("MM.YYYY"),
                    moment().format("HH:mm:ss")
                  )
                  .then(state => {
                    if (state) {
                      WallRfidSocket.emit("updateData");
                    } else {
                      console.error(state);
                    }
                  });

                queries.getUsersByUserIDAndroid(id).then(user => {
                  WallRfidSocket.emit(
                    "eventDone",
                    `Do zobaczenia ${user[0].userName}`
                  );
                });
              })
              .catch(err => console.error(err));

            break;

          case "INFO":
            getID("INFO")
              .then(data => {
                let id = data.replace(/(\r\n|\n|\r)/gm, "");

                queries.checkStatus(id).then(status => {
                  if (status && status.length > 0) {
                    switch (status[0].closeupEvent) {
                      case "startOfWork":
                        queries.getUsersByUserIDAndroid(id).then(user => {
                          if (user.length > 0) {
                            WallRfidSocket.emit(
                              "eventDone",
                              `Pracujesz  ${user[0].userName} ${id}`
                            );
                          } else {
                            WallRfidSocket.emit(
                              "eventDone",
                              `Brak użytkownika w bazie: ${id}`
                            );
                          }
                        });
                        break;

                      case "outOfWork":
                        queries.getUsersByUserIDAndroid(id).then(user => {
                          if (user.length > 0) {
                            WallRfidSocket.emit(
                              "eventDone",
                              `Nie pracujesz  ${user[0].userName} ${id}`
                            );
                          } else {
                            WallRfidSocket.emit(
                              "eventDone",
                              `Brak użytkownika w bazie: ${id}`
                            );
                          }
                        });
                        break;
                      default:
                        WallRfidSocket.emit(
                          "eventDone",
                          `Brak danych o statusie ${id}`
                        );
                        break;
                    }
                  } else {
                    WallRfidSocket.emit(
                      "eventDone",
                      `Brak użytkownika w bazie: ${id}`
                    );
                  }
                });
              })
              .catch(err => console.error(err));
            break;

          case "EVENTS":
            console.log("case EVENTS");

            getID("EVENTS")
              .then(data => {
                let id = data.replace(/(\r\n|\n|\r)/gm, "");
                queries.getEventsByUserId(id).then(events => {
                  WallRfidSocket.emit("gotEventsByUserID", events);
                });
              })
              .catch(err => console.error(err));
            break;

          case "Cancel":
            killChild();
            return;
        }
      });

      WallRfidSocket.on("disconnect", () => {
        console.log("Android Socket Disconnected");
        WallRfidSocket = null;
      });
    });
  });
