const mysql = require("mysql");
class Sql {
  constructor(config) {
    this.pool = mysql.createPool({
      host: config["host"],
      user: config["user"],
      password: config["password"],
      database: config["database"]
    });
  }

  logPool() {
    this.pool.query("SELECT * FROM `events`", function(error, results, fields) {
      if (error) throw error;
      console.log(results);
    });
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }


  getInformationsList() {
    this.pool.query("SELECT * FROM `informations`", function(
      error,
      results,
      fields
    ) {
      if (error) throw error;
      //
    });
  }
}

module.exports = Sql;
