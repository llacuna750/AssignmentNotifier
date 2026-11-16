/**
 *
 *
 * ? Responsibility: Handle business logic and validation.
 *
 *
 *
 */
import userRepository from "./user.repository.js";
import createError from "../helper/errorNamer.js";

async function showAll() {
  const users = await userRepository.findAll();
  return users;
}

async function findUserbyID(id) {
  const user = await userRepository.findById(id);
  if (!user) {
    throw createError("User not found 🥺", 404);
  }
  return user;
}

export default { showAll, findUserbyID };
