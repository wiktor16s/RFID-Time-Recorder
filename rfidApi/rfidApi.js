import { spawn } from "child_process";
import log from "../tools/Logger";

export function getID(event) {
  return new Promise(async (resolve, reject) => {
    console.log("geting id for " + event);
    log.info(`Driver: get id for ${event}`);
    let child = await spawn("python3", ["./rfidApi/mifare.py"]);

    child.stdout.on("data", function(data) {
      let response = data.toString();
      log.green(`Driver: got id for ${event} DONE`);
      child.kill();
      resolve(response);
    });

    child.stderr.on("data", data => {
      console.error(`stderr: ${data}`);
      log.error(`Driver: get id for ${event} ERROR `, data);
      child.kill();
      reject(data);
    });
  });
}
