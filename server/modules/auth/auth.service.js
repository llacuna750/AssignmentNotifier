/*
 *
 *
 *  Responsibility: Handle business logic and validation.
 *
 *
 *
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import userRepository from "../users/user.repository.js";

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function signUp(userData = {}) {
  const { name, email, password } = userData ?? {};

  if (typeof email !== "string") {
    throw createError("A valid email is required.", 400);
  }

  if (typeof password !== "string" || password.length < 8) {
    throw createError("Password must be at least 8 characters long.", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (normalizedEmail.length > 254 || !emailPattern.test(normalizedEmail)) {
    throw createError("A valid email is required.", 400);
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const userId = await userRepository.create({
    name: name.trim(),
    email: normalizedEmail,
    password_hash,
  });

  const token = jwt.sign({ userId }, process.env.JWT_SECRETS, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return {
    token,
    user: { id: userId, name: name.trim(), email: normalizedEmail, password_hash},
  };
}

export default { signUp };
