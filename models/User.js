import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  village: String,
  district: String,
  pin: String,
  dob: String,
  password: { type: String, required: true },
  referredBy: String,
  referralCount: { type: Number, default: 0 },
  referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  role: { type: String, enum: ["user", "admin"], default: "user" }  // ✅ New field
}, { timestamps: true });

export default mongoose.model("User", userSchema);
