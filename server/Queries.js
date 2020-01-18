class Queries {
  constructor(sql) {
    this.sql = sql;
  }

  async getAllUsers() {
    try {
      let users = await this.sql.query("SELECT * FROM `users`");
      if (users.length > 0) {
        users.forEach((user, index) => {
          this.checkStatus(user.userID).then(status => {
            if (status[0]) {
              switch (status[0].closeupEvent) {
                case "startOfWork":
                  user.userStatus = "Pracuje";
                  break;
                case "outOfWork":
                  user.userStatus = "Nie pracuje";
                  break;
                default:
                  user.userStatus = "Błąd";
                  break;
              }
            } else {
              user.userStatus = "Brak danych";
            }
            if (index == users.length - 1) {
              return users;
            } else {
              return [];
            }
          });
        });
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getAllEvents() {
    try {
      let events = await this.sql.query(
        "SELECT id, userID, closeupEvent, day, date, time, isPhone FROM `events`"
      );
      return events;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getPhotoByEventId(id) {
    try {
      let photo = await this.sql.query(
        "SELECT photo, adnotation FROM `events` WHERE id = ?",
        id
      );
      return photo[0];
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getEventsByName(user) {
    try {
      let events = await this.sql.query(
        "SELECT id, userID, closeupEvent, day, date, time, isPhone FROM `events` WHERE name = ?",
        [user]
      );
      return events;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getUsersByUserID(id) {
    try {
      let user = await this.sql.query(
        "SELECT * FROM `users` WHERE userID = ?",
        id
      );
      return user;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getUsersByUserIDAndroid(id) {
    try {
      let user = await this.sql.query(
        "SELECT * FROM `users` WHERE userID = ?",
        id
      );
      return user;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getEventsByUserId(id) {
    try {
      let events = await this.sql.query(
        "SELECT id, userID, closeupEvent, day, date, time, isPhone FROM `events` WHERE userID = ?",
        id
      );
      return events;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async addUser(name, id) {
    try {
      await this.sql.query(
        `INSERT INTO users (id, userID, userName, cardNumber, userStatus) VALUES (NULL, "${id}", "${name}", "${id}", "0")`
      );
      return true;
    } catch (err) {
      return err;
    }
  }

  async deleteUser(id) {
    try {
      await this.sql.query(`DELETE FROM users WHERE userID = "${id}"`);
      return true;
    } catch (err) {
      return err;
    }
  }

  async addEvent(id, status, day, date, time) {
    try {
      await this.sql.query(
        `INSERT INTO events (id, userID, closeupEvent, day, date, time, photo, adnotation) VALUES (NULL, "${id}", "${status}", "${day}", "${date}", "${time}", "", "")`
      );
      return true;
    } catch (err) {
      return err;
    }
  }

  async addEventFromPhone(id, status, day, date, time, adnotation, photo) {
    try {
      let added = await this.sql.query(
        `INSERT INTO events (userID, closeupEvent, day, date, time, adnotation, photo, isPhone) VALUES (?)`,
        [[id, status, day, date, time, adnotation, photo.base64, 1]]
      );
      return added;
    } catch (err) {
      console.log(err);
    }
  }

  async checkStatus(id) {
    try {
      let status = await this.sql.query(
        `select id, userID, closeupEvent, day, date, time from events WHERE userID = ? ORDER BY id DESC LIMIT 1`,
        id
      );
      return status;
    } catch (err) {
      return err;
    }
  }

  async deleteEvent(id) {
    try {
      await this.sql.query(`DELETE FROM events WHERE id = "${id}"`);
      return true;
    } catch (err) {
      return err;
    }
  }

  async updateEvent(eventID, day, date, time) {
    try {
      await this.sql.query(
        `UPDATE events SET day=?, date=?, time=? WHERE id = ?`,
        [day, date, time, eventID]
      );
      return true;
    } catch (err) {
      return err;
    }
  }

  async changeInfo(text) {
    try {
      await this.sql.query(
        `UPDATE informations SET text = "${text}" WHERE id = 1`
      );
      return true;
    } catch (err) {
      return err;
    }
  }

  async getInformations() {
    try {
      let informations = await this.sql.query(`SELECT * FROM informations`);
      return informations[0];
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  async changeSetTime(newTime) {
    try {
      let informations = await this.sql.query(
        `UPDATE utils SET setTime=?`,
        newTime
      );
      return informations;
    } catch (err) {
      console.error(err);
    }
  }

  async getSetTime() {
    try {
      let getTime = await this.sql.query(`SELECT setTime FROM utils`);
      return getTime[0];
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  async getToken() {
    try {
      let token = await this.sql.query(`SELECT token FROM utils`);
      return token[0];
    } catch (err) {
      console.log(err);
    }
  }

  async tryToLogIn(username, password) {
    try {
      let user = await this.sql.query(
        "SELECT * FROM `accounts` WHERE username = ? AND password = ?",
        [username, password]
      );
      return user;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Queries;
