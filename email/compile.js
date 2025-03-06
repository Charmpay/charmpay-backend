import * as fs from "fs/promises";
import path from "path";
try {
  const loginHTML = await fs.readFile(path.join("email", "login.html"), "utf8");
  const welcomeHTML = await fs.readFile(
    path.join("email", "welcome.html"),
    "utf8"
  );
  const otpHTML = await fs.readFile(path.join("email", "otp.html"), "utf8");
  const newTask = await fs.readFile(
    path.join("email", "new-task.html"),
    "utf8"
  );

  await fs.writeFile(path.join("email", "compiled.js"), "");

  await fs.appendFile(
    path.join("email", "compiled.js"),
    "export const loginHTML = `" + loginHTML + "`;\n"
  );

  await fs.appendFile(
    path.join("email", "compiled.js"),
    "export const welcomeHTML = `" + welcomeHTML + "`;\n"
  );

  await fs.appendFile(
    path.join("email", "compiled.js"),
    "export const otpHTML = `" + otpHTML + "`;\n"
  );
  await fs.appendFile(
    path.join("email", "compiled.js"),
    "export const newTask = `" + newTask + "`;\n"
  );

  console.log("Compiled");
} catch (err) {
  console.log("Error compiling HTML:", err);
}
