import mongoose from "mongoose";
import User from "../models/userModel.js";
import { handleServerError } from "../utils/functions.js";

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    handleServerError(res, error);
  }
};
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid User ID " });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    handleServerError(res, error);
  }
};
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const LoggedInUser = req.user;
    const { name } = req.body;

    if (!name) {
      return req.status(400).json({ message: "Incomplete Data " });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid User ID " });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isOwner = userId === LoggedInUser._id.toString();
    if (!isOwner) {
      return res.status(403).json({ message: "Access forbidden" });
    }

    user.name = name;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    handleServerError(res, error);
  }
};
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const LoggedInUser = req.user;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid User ID " });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isOwner = userId === LoggedInUser._id.toString();
    if (!isOwner) {
      return res.status(403).json({ message: "Access forbidden" });
    }

    await User.findByIdAndDelete({ _id: userId });
    res.cookie("jwt-cookie", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "User Deleted" });
  } catch (error) {
    handleServerError(res, error);
  }
};

export { getUsers, getUserById, updateUser, deleteUser };
