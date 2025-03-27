import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Unauthorised: NO Token",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(400).json({
        success: false,
        message: "Unauthorised: Invalid Token",
      });
    }

    const user = await User.findById(decodedToken.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Unauthorised: User not Found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      success: false,
      message: "Interval server error: protectRoute",
    });
  }
};
