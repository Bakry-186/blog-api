export const resetPasswordEmail = (name, code) => `
  <p>Hi ${name},</p>
  <p>We received a request to reset the password on your Blog App account.</p>
  <h2>${code}</h2>
  <p>Enter this code to complete the reset.</p>
  <p>Thanks for helping us keep your account secure.</p>
  <p>- The Blog App Team</p>
`;
