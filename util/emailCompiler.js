import * as fs from "fs/promises";
import * as path from "path";
import Handlebars from "handlebars";

/**
 * Compile HTML file and return a string of the HTML document.
 *
 * @param {"welcome" | "otp" | "login" | "email-changed" | "password-changed" | "new-task"} fileName The name of the template in the `/email` folder
 * @param {object} context The data to be used in the template
 *
 */
async function compileEmail(fileName, context) {
  try {
    const htmlMail = await fs.readFile(
      path.join("email", fileName + ".html"),
      "utf8"
    );
    const template = Handlebars.compile(htmlMail);
    let html = template(context);

    return html;
  } catch (error) {
    console.log(error);
  }
}

export default compileEmail;
