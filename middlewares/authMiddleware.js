import { config } from "dotenv";
import jwtPkg from "jsonwebtoken";
import User from "../models/User.js";
const { verify } = jwtPkg;

config();

/**
 * Authentication Middleware.
 * Set `req.user` to the decoded data from the jsonwebtoken
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @param {{allow: false}} options
 */
const authMiddleware = async (req, res, next, options = { allow: false }) => {
  let token = req.headers.authorization;
  if (!token)
    return res.status(401).send({
      message: "Unauthorized Request",
    });

  token = token.replace("Bearer ", "");

  try {
    let decoded = verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res.status(401).send({
        message: "Unauthorized Request",
      });

    const user = await User.findByPk(decoded.id);
    if (!user)
      return res.status(401).send({
        message: "Unauthorized Request",
      });

    if (!user.emailVerified)
      return res.status(422).send({
        message: "Your account is not verified",
      });

    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send({
      message: "Unauthorized Request",
    });
  }
};

export default authMiddleware;
