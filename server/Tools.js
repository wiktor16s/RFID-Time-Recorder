import log from "../tools/Logger";

class Tools {
  constructor() {}

  cleanup() {
    let callback = this.cleaner;

    process.on("exit", function() {
      callback();
    });

    process.on("SIGINT", function() {
      console.log("Ctrl-C...");
      callback();
      process.exit(2);
    });

    process.on("uncaughtException", function(e) {
      console.log("Uncaught Exception...");
      console.log(e.stack);
    });
  }

  cleaner() {
    log.info("App was stopped. Cleaning...");
  }
}

export default new Tools();
