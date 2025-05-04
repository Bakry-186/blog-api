import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
    passwordResetVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash the password before saving it in DB
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

export default mongoose.model("User", userSchema);
