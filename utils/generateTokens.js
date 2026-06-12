import jwt from "jsonwebtoken";

export const createSendToken = (user, res) => {
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET_ACCESS_KEY,
    { expiresIn: "7d" }
  );

  res.cookie("Authorization", `Bearer ${token}`, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ data: user, token });
};
