import fs from "fs";
import os from "os";

class Logger {
  constructor(defaultStartString = "Logger") {
    this.defaultStartString = defaultStartString + ":::";
    this.colors = {
      black: "30m",
      red: "31m",
      green: "32m",
      yellow: "33m",
      blue: "34m",
      magenta: "35m",
      cyan: "36m",
      white: "37m"
    };

    this.backgrounds = {
      black: "40m",
      red: "41m",
      green: "42m",
      yellow: "43m",
      blue: "44m",
      magenta: "45m",
      cyan: "46m",
      white: "47m"
    };

    this.pathToLogger = `${os.homedir}/RFID/`;
    this.loggerName = "log.txt";

    this.logger = fs
      .createWriteStream(this.pathToLogger + this.loggerName, {
        flags: "a" // 'a' means appending (old data will be preserved)
      })
      .on("error", e => {
        switch (e.code) {
          case "ENOENT":
            this.warning("There is no file with log. I`ll create one...");
            this.createLogFile();
            break;
          default:
            this.error(e);
            break;
        }
      });
  }

  createLogFile() {
    fs.promises
      .mkdir(this.pathToLogger, { recursive: true })
      .then(() => {
        this.info("Created path to logger");

        fs.writeFile(
          this.pathToLogger + this.loggerName,
          `${this.getDate()} --- CREATE LOG FILE ---`,
          e => {
            if (e) {
              this.error(e);
            } else {
              this.info("Created log file");
            }
          }
        );
      })
      .catch(console.error);
  }

  getDate() {
    let date = new Date();
    let full_date = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),

      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds()
    };

    if (full_date.day < 10) {
      full_date.day = `0${full_date.day}`;
    }
    if (full_date.month < 10) {
      full_date.month = `0${full_date.month}`;
    }
    if (full_date.hour < 10) {
      full_date.hour = `0${full_date.hour}`;
    }
    if (full_date.minute < 10) {
      full_date.minute = `0${full_date.minute}`;
    }
    if (full_date.second < 10) {
      full_date.second = `0${full_date.second}`;
    }

    return `${full_date.day}.${full_date.month}.${full_date.year} ${full_date.hour}:${full_date.minute}:${full_date.second}`;
  }

  write(...text) {
    for (let arg of text) {
      this.logger.write(`${this.getDate()} ${arg} ${os.EOL}`);
    }
  }

  info(...text) {
    if (text.length > 1) {
      for (let arg of text) {
        console.log(
          `\x1b[${this.backgrounds.blue}`,
          this.defaultStartString,
          `\x1b[0m \x1b[${this.colors.cyan}`,
          arg,
          `\x1b[0m`
        );
      }
    } else {
      console.log(
        `\x1b[${this.backgrounds.blue}`,
        this.defaultStartString,
        `\x1b[0m \x1b[${this.colors.cyan}`,
        text[0],
        `\x1b[0m`
      );
    }
    this.write(text);
  }

  error(...text) {
    if (text.length > 1) {
      for (let arg of text) {
        console.log(
          `\x1b[${this.backgrounds.blue}`,
          this.defaultStartString,
          `\x1b[0m \x1b[${this.colors.red}`,
          arg,
          `\x1b[0m`
        );
      }
    } else {
      console.log(
        `\x1b[${this.backgrounds.blue}`,
        this.defaultStartString,
        `\x1b[0m \x1b[${this.colors.red}`,
        text[0],
        `\x1b[0m`
      );
    }
    this.write(text);
  }

  warning(...text) {
    if (text.length > 1) {
      for (let arg of text) {
        console.log(
          `\x1b[${this.backgrounds.blue}`,
          this.defaultStartString,
          `\x1b[0m \x1b[${this.colors.yellow}`,
          arg,
          `\x1b[0m`
        );
      }
    } else {
      console.log(
        `\x1b[${this.backgrounds.blue}`,
        this.defaultStartString,
        `\x1b[0m \x1b[${this.colors.yellow}`,
        text[0],
        `\x1b[0m`
      );
    }
    this.write(text);
  }

  blue(...text) {
    if (text.length > 1) {
      for (let arg of text) {
        console.log(
          `\x1b[${this.backgrounds.blue}`,
          this.defaultStartString,
          `\x1b[0m \x1b[${this.colors.blue}`,
          arg,
          `\x1b[0m`
        );
      }
    } else {
      console.log(
        `\x1b[${this.backgrounds.blue}`,
        this.defaultStartString,
        `\x1b[0m \x1b[${this.colors.blue}`,
        text[0],
        `\x1b[0m`
      );
    }
    this.write(text);
  }

  green(...text) {
    if (text.length > 1) {
      for (let arg of text) {
        console.log(
          `\x1b[${this.backgrounds.blue}`,
          this.defaultStartString,
          `\x1b[0m \x1b[${this.colors.green}`,
          arg,
          `\x1b[0m`
        );
      }
    } else {
      console.log(
        `\x1b[${this.backgrounds.blue}`,
        this.defaultStartString,
        `\x1b[0m \x1b[${this.colors.green}`,
        text[0],
        `\x1b[0m`
      );
    }
    this.write(text);
  }
}

export default new Logger("api");
