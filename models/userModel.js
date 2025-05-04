import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required!"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: [true, "Email must be unique!"],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
    role: {
      type: String,
      enum: ["admin", "author", "user"],
      default: "user",
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
