import bcrypt from "bcryptjs";

import userRepository from "../users/user.repository.js";

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function signUp(userData = {}) {
  const { name, email, password } = userData ?? {};

  if (typeof name !== "string" || !name.trim() || name.trim().length > 255) {
    throw createError("Name is required and must be 255 characters or fewer.", 400);
  }

  if (typeof email !== "string") {
    throw createError("A valid email is required.", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (normalizedEmail.length > 254 || !emailPattern.test(normalizedEmail)) {
    throw createError("A valid email is required.", 400);
  }

  if (typeof password !== "string" || password.length < 8) {
    throw createError("Password must be at least 8 characters long.", 400);
  }

  if (Buffer.byteLength(password, "utf8") > 72) {
    throw createError("Password must be 72 bytes or fewer.", 400);
  }

  const salt = await bcrypt.genSalt(10)
  const password_hash = await bcrypt.hash(password, salt);
  const id = await userRepository.create({
    name: name.trim(),
    email: normalizedEmail,
    password_hash,
  });

  // Return public fields only; the password and hash stay on the server.
  return { id, name: name.trim(), email: normalizedEmail };
}

export default { signUp };
