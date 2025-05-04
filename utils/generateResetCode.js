import crypto from "crypto";

export const generateResetCode = () => {
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  return { resetCode, hashedResetCode };
};
