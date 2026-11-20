/**
 *
 *
 *  Todo: Responsibility: Handle business logic and validation.
 *
 *
 *
 */

import * as SubjectRepository from "./subject.repository.js";
import userRepository from "../users/user.repository.js";
import { isPureTextString } from "../helper/textChecker.js";
import createError from "../helper/errorNamer.js"; // ! Catch Error issue status Code

// Validate subject input
async function validateInput(userId, title, instructor) {
  // 1. Validate data types
  if (typeof title !== "string" || typeof instructor !== "string") {
    throw createError("Title and instructor must be strings.", 400);
  }

  // 2. Remove unnecessary whitespace
  title = title.trim();
  instructor = instructor.trim();

  // 3. Validate required fields
  if (!title || !instructor) {
    throw createError("Title and instructor are required.", 400);
  }

  // 4. Reject numeric-only strings
  if (!isPureTextString(title, instructor)) {
    throw createError("Title and instructor must contain text.", 400);
  }

  // 5. Validate user existence
  const user = await userRepository.findById(userId);

  if (user == null) {
    throw createError("User ID not found.", 404);
  }

  // 6. Check for duplicate subjects
  const isDuplicatedEntry = (await getUserSubjects(userId)).some(
    (item) => item.title === title && item.instructor === instructor,
  );

  if (isDuplicatedEntry) {
    throw createError("This subject already exists.", 409);
  }

  // 6. Return validated data
  return {
    userId,
    title,
    instructor,
  };
}

// Create subject
async function addAssignment(input) {
  const { user, title, instructor } = input;

  try {
    const data = await validateInput(user, title, instructor);
    return SubjectRepository.create(data.userId, data.title, data.instructor);
  } catch (error) {
    throw error;
  }
}

// Retrieve all subjects
async function getUserSubjects(userId) {
  return await SubjectRepository.getAll(userId);
}

// Retrieve subject by ID
async function getSubjectById(id) {
  const [subjectSelected] = await SubjectRepository.findById(id);
  return subjectSelected;
}

export { addAssignment, getUserSubjects, getSubjectById };
