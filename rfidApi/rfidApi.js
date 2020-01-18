import { spawn } from "child_process";

let child = null;

export function getID(event) {
  return new Promise(async (resolve, reject) => {
    killChild();

    console.log("geting id for " + event);
    child = await spawn("python3", ["./rfidApi/mifare.py"]);

    child.stdout.on("data", function(data) {
      let response = data.toString();
      console.log(response);
      resolve(response);
    });

    child.stderr.on("data", data => {
      console.error(`stderr: ${data}`);
      reject(data);
      killChild();
    });
  });
}

export function killChild() {
  if (child) {
    child.kill();
    child = null;
  } else {
    child = null;
  }
}
