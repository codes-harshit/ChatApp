import { generateTokenAndSetCookie } from "../lib/generateTokenAndSetCookie.js";
import { User } from "../models/user.model.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.utils.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!email || !fullName || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be minimum 6 characters.",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists, Please login.",
      });
    }
    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      email,
      password: hashedPassword,
      fullName,
    });

    if (newUser) {
      generateTokenAndSetCookie(res, newUser._id);
      await newUser.save();

      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid User data",
      });
    }
  } catch (error) {
    console.log("Erron in signing up", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Error: Signing up",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    // console.log(password, user.password);
    const isPasswordCorrect = await comparePassword(password, user.password);
    // console.log(isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Error in Logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error: Logout" });
  }
};
