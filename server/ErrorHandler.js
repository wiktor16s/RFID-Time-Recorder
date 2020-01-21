import log from "../tools/Logger";

class ErrorHandler {
  constructor() {}

  init() {
    process.on("uncaughtException", error => {
      log.error(`uncaughtException `, error);
    });

    process.on("unhandledRejection", reason => {
      switch (reason.code) {
        case "ETIMEDOUT":
          log.error("NO CONNECTION WITH DATABASE. CANNOT CONNECT.");
          break;

        default:
          log.error("unhandledRejection ", reason);
          break;
      }
    });
  }
}

export default new ErrorHandler();
