import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

import { handleServerError } from "../utils/functions.js";

const auth = async (req, res, next) => {
  try {
    const jwtCookie = req.cookies["jwt-cookie"];
    if (!jwtCookie) {
      return res
        .status(401)
        .json({ message: "Not authorized, token not found" });
    }

    let decode;
    try {
      decode = jwt.verify(jwtCookie, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }

    const user = await User.findById(decode.userId).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    handleServerError(res, error);
  }
};

export default auth;
