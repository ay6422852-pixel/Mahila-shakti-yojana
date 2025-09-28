import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Register
export const registerUser = async (req, res) => {
  try {
    const { name, mobile, village, district, pin, dob, password, referredBy, role } = req.body;

    let user = await User.findOne({ mobile });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      name,
      mobile,
      village,
      district,
      pin,
      dob,
      password: hashedPassword,
      referredBy,
      role: role || "user"
    });

    await user.save();

    // Referral count update
    if (referredBy) {
      const refUser = await User.findOne({ mobile: referredBy });
      if (refUser) {
        refUser.referralCount += 1;
        refUser.referredUsers.push(user._id);
        await refUser.save();
      }
    }

    // Auto login
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(201).json({ message: "Registered successfully", token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Login
export const loginUser = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const user = await User.findOne({ mobile });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("referredUsers", "name mobile");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("referredUsers", "name mobile");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
