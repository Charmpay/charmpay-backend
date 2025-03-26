import Handlebars from "handlebars";
import { loginHTML, welcomeHTML, otpHTML, newTask } from "../email/compiled.js";

/**
 * Compile HTML file and return a string of the HTML document.
 *
 * @param {"welcome" | "otp" | "login" | "email-changed" | "password-changed" | "new-task"} fileName The name of the template in the `/email` folder
 * @param {object} context The data to be used in the template
 *
 */
async function compileEmail(fileName, context) {
  try {
    let htmlTemplate =
      fileName === "welcome"
        ? welcomeHTML
        : fileName === "otp"
        ? otpHTML
        : fileName === "new-task"
        ? newTask
        : fileName === "login"
        ? loginHTML
        : "";

    const template = Handlebars.compile(htmlTemplate);
    let html = template(context);

    return html;
  } catch (error) {
    console.log(error);
  }
}

export default compileEmail;
