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

import log from "./tools/Logger";

const sql = new Sql(configs.db);
const queries = new Queries(sql);
const port = configs.serverPort;
const file = new staticFiles.Server(path.join(__dirname, "client"));

log.write("App start");

const server = http
  .createServer(function(request, response) {
    request
      .addListener("end", function() {
        file.serve(request, response);
      })
      .resume();
  })
  .listen(port, () => {
    //console.log("server listening on port " + port);
    log.info(`Server listening on port ${port}`);

    const wallRfidIO = getSocketInstance(server, "/android");
    const adminIo = getSocketInstance(server, "/admin");
    const remoteIO = getSocketInstance(server, "/remoteUser");

    process.stdin.resume();
    tools.cleanup();
    errorHandler.init();

    remoteIO.on("connection", remoteSocket => {
      log.green(`Remote phone user connected with id: ${remoteSocket.id}`);

      remoteSocket.on("event", (event, photo, id, adnotation, date) => {
        switch (event) {
          case "startOfWork":
            log.blue(
              `Remote phone with id: ${remoteSocket.id} emit START_OF_WORK event`
            );
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
            queries.addEventFromPhone(
              id,
              event,
              date.day,
              date.date,
              date.time,
              adnotation,
              photo
            );
            log.blue(
              `Remote phone with id: ${remoteSocket.id} emit OUT_OF_WORK event`
            );
            break;
        }
      });

      remoteSocket.on("logMe", (username, password) => {
        queries
          .tryToLogIn(username, password)
          .then(e => {
            if (e.length > 0) {
              log.blue(
                `Remote phone with id: ${remoteSocket.id} Login Success - ${username}`
              );
            } else {
              log.blue(
                `Remote phone with id: ${remoteSocket.id} Login Failed - ${username}`
              );
            }
            remoteSocket.emit("logRes", e);
          })
          .catch(err => {
            log.error(
              `Admin with id: ${WallRfidSocket.id} cannot tryToLogin`,
              err
            );
          });
      });
    });

    adminIo.on("connection", function(AdminSocket) {
      log.blue(`Admin with id: ${AdminSocket.id} Connected`);

      AdminSocket.on("getAllUsers", () => {
        queries
          .getAllUsers()
          .then(users => {
            AdminSocket.emit("gotUsers", users);
          })
          .catch(err => {
            log.error(
              `Admin with id: ${WallRfidSocket.id} cannot getAllUsers `,
              err
            );
          });
      });

      AdminSocket.on("getAllEvents", () => {
        queries
          .getAllEvents()
          .then(events => {
            AdminSocket.emit("gotEvents", events);
          })
          .catch(err => {
            log.error(
              `Admin with id: ${WallRfidSocket.id} cannot getAllEvents `,
              err
            );
          });
      });

      AdminSocket.on("getEventsByName", user => {
        queries
          .getEventsByName(user)
          .then(events => {
            AdminSocket.emit("gotEventsByName", events);
          })
          .catch(err => {
            log.error(
              `Admin with id: ${WallRfidSocket.id} cannot getEventsByName `,
              err
            );
          });
      });
      AdminSocket.on("getUsersByUserID", id => {
        queries
          .getUsersByUserID(id)
          .then(user => {
            AdminSocket.emit("gotUsersByUserID", user);
          })
          .catch(err => {
            log.error(
              `Admin with id: ${WallRfidSocket.id} cannot getUsersByUserID `,
              err
            );
          });
      });
      AdminSocket.on("getEventsByUserID", id => {
        queries
          .getEventsByUserId(id)
          .then(events => {
            AdminSocket.emit("gotEventsByUserID", events);
          })
          .catch(err => {
            log.error(
              `Admin with id: ${WallRfidSocket.id} cannot getEventsByUserID `,
              err
            );
          });
      });

      AdminSocket.on("addUser", (name, id) => {
        queries
          .addUser(name, id)
          .then(state => {
            if (state) {
              AdminSocket.emit("updateData");
              log.green(
                `Admin with id: ${AdminSocket.id} Added user ${name} ${id}`
              );
            } else {
              console.error(state);
              log.error(
                `Admin with id: ${AdminSocket.id} Add user failed`,
                state
              );
            }
          })
          .catch(err => {
            log.error(
              `Admin with id: ${WallRfidSocket.id} cannot addUser `,
              err
            );
          });
      });

      AdminSocket.on("deleteUser", id => {
        queries
          .deleteUser(id)
          .then(state => {
            if (state) {
              AdminSocket.emit("updateData");
              log.green(`Admin with id: ${AdminSocket.id} deleted user ${id}`);
            } else {
              console.error(state);
              log.error(
                `Admin with id: ${AdminSocket.id} delete user failed ${state}`
              );
            }
          })
          .catch(err => {
            log.error(
              `Admin with id: ${WallRfidSocket.id} cannot deleteUser `,
              err
            );
          });
      });

      AdminSocket.on("addEvent", (id, status, day, date, time) => {
        queries
          .addEvent(id, status, day, date, time)
          .then(state => {
            if (state) {
              AdminSocket.emit("updateData");
              log.green(
                `Admin with id: ${AdminSocket.id} added event ${status} ${id} ${day} ${date} ${time}`
              );
            } else {
              log.error(
                `Admin with id: ${AdminSocket.id} add event failed ${status} ${id} ${day} ${date} ${time}`
              );
            }
          })
          .catch(err => {
            log.error(
              `Admin with id: ${WallRfidSocket.id} cannot addEvent `,
              err
            );
          });
      });

      AdminSocket.on("deleteEvent", id => {
        queries
          .deleteEvent(id)
          .then(state => {
            if (state) {
              AdminSocket.emit("updateData");
              log.green(`Admin with id: ${AdminSocket.id} deleted event ${id}`);
            } else {
              console.error(state);
              log.error(
                `Admin with id: ${AdminSocket.id} delete user failed ${state}`
              );
            }
          })
          .catch(err => {
            log.error(
              `Admin with id: ${WallRfidSocket.id} cannot deleteEvent `,
              err
            );
          });
      });

      AdminSocket.on("changeInformations", text => {
        queries
          .changeInfo(text)
          .then(state => {
            if (state) {
              AdminSocket.emit("updateData");
              log.green(
                `Admin with id: ${AdminSocket.id} changed informations on ${text}`
              );
            } else {
              log.error(
                `Admin with id: ${AdminSocket.id} change information failed ${state}`
              );
            }
          })
          .catch(err => {
            log.error(
              `Admin with id: ${WallRfidSocket.id} cannot changeInformations `,
              err
            );
          });
      });

      AdminSocket.on("getInformations", () => {
        queries
          .getInformations(AdminSocket)
          .then(informations => {
            AdminSocket.emit("gotInformations", informations);
          })
          .catch(err => {
            log.error(
              `Admin with id: ${WallRfidSocket.id} cannot getInformations `,
              err
            );
          });
      });

      AdminSocket.on("getSetTime", () => {
        queries
          .getSetTime()
          .then(setTime => {
            AdminSocket.emit("gotSetTime", setTime);
          })
          .catch(err => {
            log.error(
              `Admin with id: ${WallRfidSocket.id} cannot getSetTime`,
              err
            );
          });
      });

      AdminSocket.on("changeSetTime", newTime => {
        queries
          .changeSetTime(newTime)
          .then(() => {
            AdminSocket.emit("updateData");
            log.green(
              `Admin with id: ${AdminSocket.id} changed default time to `,
              newTime
            );
          })
          .catch(err => {
            log.error(
              `Admin with id: ${WallRfidSocket.id} cannot changeSetTime `,
              err
            );
          });
      });

      AdminSocket.on("updateEvent", (eventID, day, date, time) => {
        queries
          .updateEvent(eventID, day, date, time)
          .then(state => {
            if (state) {
              AdminSocket.emit("updateData");
              log.green(
                `Admin with id: ${AdminSocket.id} edited event ${eventID} ${day} ${date} ${time}`
              );
            } else {
              console.error(state);
              log.error(
                `Admin with id: ${AdminSocket.id} edit event failed ${eventID}`
              );
            }
          })
          .catch(err => {
            log.error(
              `Admin with id: ${WallRfidSocket.id} cannot updateEvent `,
              err
            );
          });
      });

      AdminSocket.on("checkStatus", id => {
        queries
          .checkStatus(id)
          .then(status => {
            adminSocket.emit("checkStatus-response", status);
          })
          .catch(err => {
            log.error(
              `Admin with id: ${WallRfidSocket.id} cannot checkStatus `,
              err
            );
          });
      });

      AdminSocket.on("getPhotoByEventId", id => {
        queries
          .getPhotoByEventId(id)
          .then(e => {
            AdminSocket.emit("gotPhotoByEventId", e);
            log.green(`Admin with id: ${AdminSocket.id} got user photo ${id}`);
          })
          .catch(err => {
            log.error(
              `Admin with id: ${AdminSocket.id} cannot get photo ${id}`,
              err
            );
          });
      });

      AdminSocket.on("checkToken", actualToken => {
        queries
          .getToken()
          .then(response => {
            if (response.token === actualToken) {
              AdminSocket.emit("checkedToken", true);
              log.green(
                `Admin with id: ${AdminSocket.id} have valid token ${id}`
              );
            } else {
              AdminSocket.emit("checkedToken", false);
              log.error(
                `Admin with id: ${AdminSocket.id} have invalid token ${actualToken}`
              );
            }
          })
          .catch(err => {
            log.error(
              `Admin with id: ${WallRfidSocket.id} cannot checkToken `,
              err
            );
          });
      });

      AdminSocket.on("disconnect", () => {
        log.info(`Admin with id: ${AdminSocket.id} disconnected`);
      });
    });

    wallRfidIO.on("connection", function(WallRfidSocket) {
      log.green(`RFID with id: ${WallRfidSocket.id} connected`);

      WallRfidSocket.on("getInformations", text => {
        queries
          .getInformations()
          .then(informations => {
            WallRfidSocket.emit("gotInformations", informations);
            log.green(`RFID with id: ${WallRfidSocket.id} Got informations`);
          })
          .catch(err => {
            log.error(
              `RFID with id: ${WallRfidSocket.id} cannot get informations `,
              err
            );
          });
      });

      WallRfidSocket.on("getEventsByUserID", id => {
        queries
          .getEventsByUserId(id)
          .then(events => {
            WallRfidSocket.emit("gotEventsByUserID", events);
          })
          .catch(err => {
            log.error(
              `RFID with id: ${WallRfidSocket.id} cannot get eventsByUserID `,
              err
            );
          });
      });

      WallRfidSocket.on("addEvent", (id, status, day, date, time) => {
        queries
          .addEvent(id, status, day, date, time)
          .then(state => {
            if (state) {
              WallRfidSocket.emit("updateData");
              log.green(
                `RFID with id: ${WallRfidSocket.id} user ${id} ${status} ${day} ${date} ${time}`
              );
            } else {
              log.green(
                `RFID with id: ${WallRfidSocket.id} error while adding event ${id} ${status} ${day} ${date} ${time}`
              );
            }
          })
          .catch(err => {
            log.error(
              `RFID with id: ${WallRfidSocket.id} cannot add event `,
              err
            );
          });
      });

      WallRfidSocket.on("data-from-android", message => {
        switch (message.data) {
          case "IN":
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
                      log.green(
                        `RFID with id: ${WallRfidSocket.id} success start of work`
                      );
                    } else {
                      log.error(
                        `RFID with id: ${WallRfidSocket.id} error while start of work `,
                        state
                      );
                    }
                  })
                  .catch(err => {
                    log.error(
                      `RFID with id: ${WallRfidSocket.id} cannot add event `,
                      err
                    );
                  });

                queries
                  .getUsersByUserIDAndroid(id)
                  .then(user => {
                    log.green(
                      `RFID with id: ${WallRfidSocket.id} user ${user[0].userName} get in`
                    );
                    WallRfidSocket.emit(
                      "eventDone",
                      `Dzień dobry ${user[0].userName}`
                    );
                  })
                  .catch(err => {
                    log.error(
                      `RFID with id: ${WallRfidSocket.id} cannot getUsersByUserIDAndroid `,
                      err
                    );
                  });
              })
              .catch(err => {
                log.error(
                  `RFID with id: ${WallRfidSocket.id} user ${user[0].userName} get in ERROR `,
                  err
                );
              });
            break;

          case "OUT":
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
                      log.green(
                        `RFID with id: ${WallRfidSocket.id} success out of work`
                      );
                    } else {
                      log.error(
                        `RFID with id: ${WallRfidSocket.id} error while out of work `,
                        state
                      );
                    }
                  })
                  .catch(err => {
                    log.green(
                      `RFID with id: ${WallRfidSocket.id} cannot add event `,
                      err
                    );
                  });

                queries
                  .getUsersByUserIDAndroid(id)
                  .then(user => {
                    log.green(
                      `RFID with id: ${WallRfidSocket.id} user ${user[0].userName} get out`
                    );
                    WallRfidSocket.emit(
                      "eventDone",
                      `Do zobaczenia ${user[0].userName}`
                    );
                  })
                  .catch(err => {
                    log.green(
                      `RFID with id: ${WallRfidSocket.id} cannot get usersByUserIDAndroid `,
                      err
                    );
                  });
              })
              .catch(err => {
                log.error(
                  `RFID with id: ${WallRfidSocket.id} user ${user[0].userName} get out ERROR `,
                  err
                );
              });

            break;

          case "INFO":
            getID("INFO")
              .then(data => {
                let id = data.replace(/(\r\n|\n|\r)/gm, "");

                queries
                  .checkStatus(id)
                  .then(status => {
                    if (status && status.length > 0) {
                      switch (status[0].closeupEvent) {
                        case "startOfWork":
                          queries
                            .getUsersByUserIDAndroid(id)
                            .then(user => {
                              log.green(
                                `RFID with id: ${WallRfidSocket.id} user ${user[0].userName} read info`
                              );
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
                            })
                            .catch(err => {
                              log.green(
                                `RFID with id: ${WallRfidSocket.id} cannot get usersByUserIDAndroid `,
                                err
                              );
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
                  })
                  .catch(err => {
                    log.green(
                      `RFID with id: ${WallRfidSocket.id} cannot checkStatus `,
                      err
                    );
                  });
              })
              .catch(err => {
                log.error(
                  `RFID with id: ${WallRfidSocket.id} user ${user[0].userName} read info ERROR `,
                  err
                );
              });
            break;

          case "EVENTS":
            getID("EVENTS")
              .then(data => {
                let id = data.replace(/(\r\n|\n|\r)/gm, "");
                queries.getEventsByUserId(id).then(events => {
                  WallRfidSocket.emit("gotEventsByUserID", events);
                  log.error(
                    `RFID with id: ${WallRfidSocket.id} user ${id} got events view`
                  );
                });
              })
              .catch(err => {
                log.error(
                  `RFID with id: ${WallRfidSocket.id} user ${user[0].userName} cannot get events ERROR `,
                  err
                );
              });
            break;

          case "Cancel":
            return;
        }
      });

      WallRfidSocket.on("disconnect", () => {
        log.info(`RFID with id: ${WallRfidSocket.id} disconnected`);
      });
    });
  });
