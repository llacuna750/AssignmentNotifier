/**
 *
 *
 * ? Responsibility: Handle business logic and validation.
 *
 *
 *
 */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserRepository from "../users/user.repository.js";
import createError from "../helper/errorNamer.js";
import isPureTextString from "../helper/pureTextChecker.js";

async function signUp(userData) {
  const { name, email, password } = userData ?? {};

  if (typeof email !== "string") {
    throw createError("A valid email is required. ⚠️", 400);
  }

  if (typeof password !== "string" || password.length < 8) {
    throw createError(
      "Password must be at least 8 characters long. api/v1/auth/sign-in ⚠️",
      400,
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (normalizedEmail.length > 254 || !emailPattern.test(normalizedEmail)) {
    throw createError("A valid email is required. ⚠️", 400);
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const userId = await UserRepository.create({
    name: name.trim(),
    email: normalizedEmail,
    password_hash,
  });

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return {
    token,
    user: {
      id: userId,
      name: name.trim(),
      email: normalizedEmail,
    },
  };
}

async function signIn(userData) {
  const { email, password } = userData ?? {};

  if (email === undefined || password === undefined) {
    throw createError("Email or password must required ⚠️", 400);
  }

  if (
    !isPureTextString(email.split("@").filter((element) => element !== "")[0])
  ) {
    throw createError(
      `email must valid and contain text.   example: <String> @example.com ⚠️`,
      400,
    );
  }

  const user = await UserRepository.findByEmail(email);
  if (!user) {
    throw createError("User not found! 🙁", 404);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw createError("Invalid password 🙁", 401);
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

async function signOut(userData) {}

{
  // const email = 'llacuna750@@@gmail.com'
  // const emailnum = '12314125750@gmail.com'
  // console.log(email.split("@").filter((element) => element !== "")[0]);
  // let userData;
  // let { email, password } = userData ?? {};
  // email = 'Email'
  // password = '1231412@'
  // console.log(email, password)
}

export default { signUp, signIn, signOut };
