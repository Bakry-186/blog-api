import jwt from "jsonwebtoken";

export const createSendToken = (user, res) => {
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET_ACCESS_KEY,
    { expiresIn: "15m" }
  );

  res.cookie("Authorization", `Bearer ${token}`, {
    expires: new Date(Date.now() + 15 * 60 * 1000),
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ token, data: user });
};
