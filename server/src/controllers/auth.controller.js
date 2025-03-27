import { User } from "../models/user.model.js";
import { hashPassword } from "../utils/bcrypt.utils.js";

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
export const login = async (req, res) => {};
export const logout = async (req, res) => {};
